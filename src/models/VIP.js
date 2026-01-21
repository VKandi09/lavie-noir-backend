import mongoose from "mongoose";

const vipSchema = new mongoose.Schema (
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: String,
        location: {
            type: String,
            required: true
        },
        interest: {
            type: String,
            required: true
        },
        message: String,
        status: {
            type: String,
            enum: ["pending", "confirmed", "declined"],
            default: "pending"
        }
    },
    { timestamps: true }
);

export default mongoose.model("VIP", vipSchema);