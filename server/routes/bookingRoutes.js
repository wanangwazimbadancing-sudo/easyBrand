import express from "express";
import {
  submitBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
} from "../controllers/bookingController.js";
import bookingLimiter from "../middleware/rateLimiter.js";
import { isAuthenticated } from "../middleware/Auth.js";

const router = express.Router();

// Submit a new booking
router.post("/", bookingLimiter, submitBooking);

// Get all bookings
router.get("/",isAuthenticated, getBookings);

// Get a specific booking by ID
router.get("/:id",isAuthenticated, getBookingById);

// Update booking status
router.patch("/:id",isAuthenticated, updateBookingStatus);

export default router;
