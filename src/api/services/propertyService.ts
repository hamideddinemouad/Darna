import Property from "../../models/propertyModel.ts";

class PropertyService {
    
    async getPropertyById(propertyId: string) {
        return await Property.findById(propertyId).populate("owner", "firstname lastname email");
    }

    async getAllActiveProperties() {
        return await Property.find({ status: "active" })
            .populate("owner", "firstname lastname")
            .sort({ createdAt: -1 });
    }
}

export default PropertyService;