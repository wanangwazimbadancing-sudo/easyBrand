import express from "express";
import {
  getPageData,
  updatePageData,
} from "../controllers/pageDataController.js";

const router = express.Router();

// Get specific page data by type (plans, videos, contact, faqs)
router.get("/:dataType", getPageData);

// Update page data by type
router.post("/:dataType", updatePageData);

export default router;
