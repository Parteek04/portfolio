import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    type: {
      type: String,
      required: true,
      trim: true,
      enum: ["Internship", "Training", "Volunteer Work", "Volunteering", "Open Source", "Hackathons", "Freelancing", "Job", "Project"]
    },
    duration: { type: String, required: true, trim: true },
    description: [{ type: String }],
    techStack: [{ type: String }]
  },
  { timestamps: true }
);

const Experience = mongoose.model("Experience", experienceSchema);
export default Experience;
