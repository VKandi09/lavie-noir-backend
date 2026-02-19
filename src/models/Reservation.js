import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },

    reservationDateTime: {
      type: Date,
      required: true,
    },

    partySize: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },

    occasion: { type: String, trim: true },
    notes: { type: String, trim: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);
