import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            required: true
        },
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        reason: {
            type: String,
            enum: [
                "inappropriate_content",
                "fake_listing",
                "wrong_information",
                "spam",
                "scam",
                "other"
            ],
            required: true
        },
        description: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false
        },
        reviewedAt: {
            type: Date,
            required: false
        },
        adminNotes: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;