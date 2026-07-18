import Project from "../models/Project.js";
import Skill from "../models/Skill.js";
import Education from "../models/Education.js";
import Experience from "../models/Experience.js";
import Achievement from "../models/Achievement.js";

const models = {
  projects: Project,
  skills: Skill,
  education: Education,
  experience: Experience,
  achievements: Achievement
};

// Generic CRUD handlers
export const getAll = (resourceType) => async (req, res, next) => {
  try {
    const Model = models[resourceType];
    if (!Model) {
      res.status(400);
      throw new Error(`Invalid resource type: ${resourceType}`);
    }
    const data = await Model.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

export const getById = (resourceType) => async (req, res, next) => {
  try {
    const Model = models[resourceType];
    if (!Model) {
      res.status(400);
      throw new Error(`Invalid resource type: ${resourceType}`);
    }
    const item = await Model.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error("Item not found");
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const create = (resourceType) => async (req, res, next) => {
  try {
    const Model = models[resourceType];
    if (!Model) {
      res.status(400);
      throw new Error(`Invalid resource type: ${resourceType}`);
    }
    const item = await Model.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const update = (resourceType) => async (req, res, next) => {
  try {
    const Model = models[resourceType];
    if (!Model) {
      res.status(400);
      throw new Error(`Invalid resource type: ${resourceType}`);
    }
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) {
      res.status(404);
      throw new Error("Item not found");
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const remove = (resourceType) => async (req, res, next) => {
  try {
    const Model = models[resourceType];
    if (!Model) {
      res.status(400);
      throw new Error(`Invalid resource type: ${resourceType}`);
    }
    const item = await Model.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error("Item not found");
    }
    await item.deleteOne();
    res.status(200).json({ success: true, message: "Item removed successfully" });
  } catch (error) {
    next(error);
  }
};
