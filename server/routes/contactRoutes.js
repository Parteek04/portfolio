import express from "express";
import {
  submitContactForm,
  getMessages,
  markAsRead,
  deleteMessage
} from "../controllers/contactController.js";
import protect from "../middlewares/auth.js";

const router = express.Router();

router.post("/", submitContactForm);
router.get("/messages", protect, getMessages);
router.put("/messages/:id", protect, markAsRead);
router.delete("/messages/:id", protect, deleteMessage);

export default router;
