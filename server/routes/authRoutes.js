import express from "express";
import { login, verifyToken, setupAdmin } from "../controllers/authController.js";
import protect from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/setup", setupAdmin);
router.get("/verify", protect, verifyToken);

export default router;
