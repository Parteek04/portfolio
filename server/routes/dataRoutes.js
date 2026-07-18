import express from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove
} from "../controllers/dataControllers.js";
import protect from "../middlewares/auth.js";

const router = express.Router();
const resources = ["projects", "skills", "education", "experience", "achievements"];

resources.forEach((resource) => {
  // Public GET endpoints
  router.get(`/${resource}`, getAll(resource));
  router.get(`/${resource}/:id`, getById(resource));

  // Protected Admin write endpoints
  router.post(`/${resource}`, protect, create(resource));
  router.put(`/${resource}/:id`, protect, update(resource));
  router.delete(`/${resource}/:id`, protect, remove(resource));
});

export default router;
