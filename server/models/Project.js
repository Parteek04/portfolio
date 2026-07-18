import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    description: { type: String, required: true },
    longDescription: { type: String },
    image: { type: String, default: "/images/placeholder.png" },
    techStack: [{ type: String }],
    features: [{ type: String }],
    github: { type: String, default: "" },
    demo: { type: String, default: "" },
    caseStudy: {
      problem: { type: String, default: "" },
      solution: { type: String, default: "" },
      challenges: [{ type: String }],
      results: { type: String, default: "" }
    },
    futureImprovements: [{ type: String }]
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
