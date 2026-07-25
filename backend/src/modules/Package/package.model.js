import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    shortDescription: {
      type: String,
    },
    description: String,
    location: {
      type: String,
      required: true,
    },
    state: String,
    country: String,
    duration: String,
    price: Number,
    discountPrice: Number,
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    difficulty: String,
    maxPeople: Number,
    featured: {
      type: Boolean,
      default: false,
    },
    thumbnail: String,
    images: [
      {
        type: String,
      },
    ],
    itinerary: [
      {
        day: Number,
        title: String,
        description: String,
      },
    ],
    packageIncluded: [
      {
        type: String,
      },
    ],
    packageExcluded: [
      {
        type: String,
      },
    ],
    category: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default  mongoose.model("Package", packageSchema);
