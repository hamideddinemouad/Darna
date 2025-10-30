import Property from "../../models/propertyModel.ts";
import type mongoose from "mongoose";

class PropertyService {
    
    async getPropertyById(propertyId: string) {
        return await Property.findById(propertyId).populate("owner", "firstname lastname email");
    }

    async getAllActiveProperties() {
        return await Property.find({ status: "active" })
            .populate("owner", "firstname lastname")
            .sort({ createdAt: -1 });
    }

    async createProperty(propertyData: any, ownerId: mongoose.Types.ObjectId) {
        const newProperty = new Property({
            ...propertyData,
            owner: ownerId,
            status: "active"
        });
        return await newProperty.save();
    }

    async updateProperty(propertyId: string, ownerId: string, updateData: any) {
        const property = await Property.findById(propertyId);

        if (!property) {
            throw new Error("Property not found");
        }

        if (property.owner.toString() !== ownerId.toString()) {
            throw new Error("Unauthorized");
        }

        Object.assign(property, updateData);
        return await property.save();
    }

    async getPropertiesByOwner(ownerId: string) {
        return await Property.find({ owner: ownerId }).sort({ createdAt: -1 });
    }
}

export default PropertyService;