import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    level: { type: Number, required: true, min: 0, max: 100 },
    icon: { type: String, default: "FaCode" },
    color: { type: String, default: "#6366f1" },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Programming Languages",
        "Web Development",
        "Data Science & Machine Learning",
        "Databases",
        "Tools & Platforms",
        "Soft Skills"
      ]
    }
  },
  { timestamps: true }
);

const Skill = mongoose.model("Skill", skillSchema);
export default Skill;
