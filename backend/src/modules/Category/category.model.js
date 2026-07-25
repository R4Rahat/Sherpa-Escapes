import mongoose, { model } from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    icon: String,
  },
  {
    timestamps: true,
  },
);

export default  mongoose.model("Category", categorySchema);
