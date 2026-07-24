import { Schema, model } from "mongoose";

const tourSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    place: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true }, // e.g. "3 days / 2 nights"
    images: [{ type: String }], // Imagekit URLs or Unsplash links
    highlights: [{ type: String }], // bullet points
    isActive: { type: Boolean, default: true },
    // payment integration ready
    // paymentEnabled: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default model("Tour", tourSchema);
