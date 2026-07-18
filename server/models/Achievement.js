import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    organization: { type: String, trim: true },
    date: { type: String, trim: true },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: ["Coding", "Competition", "Certificate", "Badges", "DSA Progress"]
    },
    description: { type: String, default: "" },
    badge: { type: String, default: "" }
  },
  { timestamps: true }
);

const Achievement = mongoose.model("Achievement", achievementSchema);
export default Achievement;
