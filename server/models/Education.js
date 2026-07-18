import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    degree: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    score: { type: String, trim: true },
    description: { type: String, default: "" },
    courses: [{ type: String }]
  },
  { timestamps: true }
);

const Education = mongoose.model("Education", educationSchema);
export default Education;
