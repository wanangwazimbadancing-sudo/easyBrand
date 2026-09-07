import express from "express";
import multer from "multer";
import {
  createContent,
  getAllContent,
  getContentById,
  updateContent,
  deleteContent,
} from "../controllers/contentController.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No video file uploaded." });
    }

    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "happy-zimba/videos",
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        stream.end(req.file.buffer);
      });

    const result = await streamUpload();

    return res.status(200).json({
      success: true,
      message: "Video uploaded successfully",
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to upload video to Cloudinary",
    });
  }
});

// Create new content
router.post("/", createContent);

// Get all content
router.get("/", getAllContent);

// Get specific content
router.get("/:id", getContentById);

// Update content
router.put("/:id", updateContent);

// Delete content
router.delete("/:id", deleteContent);

export default router;
