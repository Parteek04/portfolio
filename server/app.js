import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import dataRoutes from "./routes/dataRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: false // Allow loading uploaded images from server on localhost
  })
);

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || "https://portfolio-six-black-xf00gxhq7u.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002"
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// Compression & Body Parser
app.use(compression());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Static Folder for Uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount API Routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", dataRoutes); // mounts /api/projects, /api/skills, etc.

// Base route
app.get("/", (req, res) => {
  res.json({ message: "MERN Portfolio API is running..." });
});

// Error handling middleware
app.use(errorHandler);

export default app;
