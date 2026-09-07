import express from "express";

import { fetchMessages, submitContactForm} from "../controllers/contactController.js";

import contactLimiter from "../middleware/rateLimiter.js";

import {contactValidation,handleValidationErrors,} from "../middleware/validation.js";
import { isAuthenticated } from "../middleware/Auth.js";

const router = express.Router();

router.post(
  "/",
  contactLimiter,
  contactValidation,
  handleValidationErrors,
  submitContactForm
);

router.get("/", isAuthenticated, fetchMessages);

export default router;