import Booking from "../models/Booking.js";

const submitBooking = async (req, res) => {
  try {
    const { fullName, email, phone, plan, billing, price } = req.body;

    // Validate required fields
    if (!fullName || !email || !plan || !billing || !price) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const booking = await Booking.create({
      fullName,
      email,
      phone,
      plan,
      billing,
      price,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Booking submitted successfully",
      booking,
    });
  } catch (error) {
    console.error("Booking submit error:", error);
    return res.status(500).json({
      success: false,
      message: "Error submitting booking",
    });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch bookings",
    });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Fetch booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch booking",
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking status updated",
      booking,
    });
  } catch (error) {
    console.error("Update booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update booking",
    });
  }
};

export { submitBooking, getBookings, getBookingById, updateBookingStatus };
