import express from "express";
import {
  getSettings,
  updateSettings,
  incrementVisitorCount
} from "../controllers/settingsController.js";
import protect from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getSettings);
router.put("/", protect, updateSettings);
router.post("/visit", incrementVisitorCount);

export default router;
