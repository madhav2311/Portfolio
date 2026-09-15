import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, trim: true },
    category: { type: String, default: "Full-Stack", trim: true },
    description: { type: String, default: "" },
    arch: { type: String, default: "" },
    features: { type: [String], default: [] },
    stack: { type: [String], default: [] },
    demo: { type: String, default: "" },
    github: { type: String, default: "" },
    cover: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
