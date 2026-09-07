import { body, validationResult } from "express-validator";

const contactValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email.")
    .normalizeEmail(),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required.")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Message must be between 10 and 2000 characters."),
];

const bookingValidation = [
  body("service")
    .notEmpty()
    .withMessage("Service is required.")
    .isIn([
      "strategy-call",
      "growth-plan",
      "monthly-coaching",
    ])
    .withMessage("Invalid service selected."),

  body("date")
    .notEmpty()
    .withMessage("Date is required.")
    .isISO8601()
    .withMessage("Invalid date."),

  body("time")
    .trim()
    .notEmpty()
    .withMessage("Time is required."),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email.")
    .normalizeEmail(),

  body("phone")
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage("Phone number is too long."),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Notes cannot exceed 2000 characters."),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  next();
};

export {
  contactValidation,
  bookingValidation,
  handleValidationErrors,
};