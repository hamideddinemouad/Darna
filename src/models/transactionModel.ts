import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            required: false
        },
        type: {
            type: String,
            enum: ["subscription", "featured_listing", "premium_placement", "commission"],
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: "MAD"
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed", "refunded"],
            default: "pending"
        },
        paymentMethod: {
            type: String,
            enum: ["credit_card", "bank_transfer", "cash", "paypal"],
            required: false
        },
        description: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;