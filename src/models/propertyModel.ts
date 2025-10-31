import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        location: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            region: { type: String, required: true },
            country: { type: String, default: "Morocco" }
        },
        characteristics: {
            bedrooms: { type: Number, default: 0 },
            bathrooms: { type: Number, default: 0 },
            surface: { type: Number, required: true },
            type: { 
                type: String, 
                enum: ["Appartement", "Maison", "Villa", "Studio", "Terrain", "Bureau"],
                required: true 
            }
        },
        media: {
            images: [{ type: String }],
            videos: [{ type: String }]
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DarnaUserProfile",
            required: true
        },
        status: {
            type: String,
            enum: ["active", "inactive", "sold"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;