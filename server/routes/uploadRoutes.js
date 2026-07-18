import express from "express";
import upload from "../middlewares/upload.js";
import protect from "../middlewares/auth.js";

const router = express.Router();

// @desc    Upload an image or document
// @route   POST /api/upload
// @access  Private (Admin only)
router.post("/", protect, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Build the URL for the uploaded file
    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: "File uploaded successfully!",
      url: fileUrl,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
