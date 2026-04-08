const { body, param, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validatorGetAppointmentsByClient = [
  param("id")
    .notEmpty()
    .withMessage("client_id is required")
    .isInt({ min: 1 })
    .withMessage("client_id must be a positive integer "),
  handleValidationErrors,
];

const validatorGetAppointmentsByStaff = [
  param("id")
    .notEmpty()
    .withMessage("staff_id is required")
    .isInt({ min: 1 })
    .withMessage("staff_id must be a positive integer "),
  handleValidationErrors,
];
const validatorGetAppointmentById = [
  param("id")
    .notEmpty()
    .withMessage("appointment_id is required")
    .isInt({ min: 1 })
    .withMessage("appointment_id must be a positive integer "),
  handleValidationErrors,
];

const validatorUpdateAppointmentStatus = [
  param("id")
    .notEmpty()
    .withMessage("appointment_id is required")
    .isInt({ min: 1 })
    .withMessage("appointment_id must be a positive integer "),
  body("status")
    .notEmpty()
    .withMessage("status is required")
    .isIn(["pending", "confirmed", "completed", "cancelled", "no_show"])
    .withMessage(
      "status must be one of pending, confirmed, completed, cancelled, no_show",
    ),
  handleValidationErrors,
];

const validatorCancelAppointment = [
  param("id")
    .notEmpty()
    .withMessage("appointment_id is required")
    .isInt({ min: 1 })
    .withMessage("appointment_id must be a positive integer "),
  handleValidationErrors,
];
const validatorUpdateAppointment = [
  param("id")
    .notEmpty()
    .withMessage("appointment_id is required")
    .isInt({ min: 1 })
    .withMessage("appointment_id must be a positive integer "),

  body("client_id")
    .notEmpty()
    .withMessage("client_id is required")
    .isInt({ min: 1 })
    .withMessage("client_id must be a positive integer "),

  body("staff_id")
    .notEmpty()
    .withMessage("staff_id is required")
    .isInt({ min: 1 })
    .withMessage("staff_id must be a positive integer "),

  body("appointment_start_at")
    .notEmpty()
    .withMessage("appointment_start_at is required")
    .isISO8601()
    .withMessage("appointment_start_at must be a valid ISO 8601 date"),

  body("appointment_ends_at")
    .notEmpty()
    .withMessage("appointment_ends_at is required")
    .isISO8601()
    .withMessage("appointment_ends_at must be a valid ISO 8601 date"),

  body("appointment_notes")
    .optional()
    .isString()
    .withMessage("appointment_notes must be a string")
    .trim(),

  handleValidationErrors,
];

const validatorCheckAppointmentConflict = [
  body("staff_id")
    .notEmpty()
    .withMessage("staff_id is required")
    .isInt({ min: 1 })
    .withMessage("staff_id must be a positive integer ")
    .toInt(),

  body("appointment_start_at")
    .notEmpty()
    .withMessage("appointment_start_at is required")
    .isISO8601()
    .withMessage("appointment_start_at must be a valid ISO8601 date"),

  body("appointment_ends_at")
    .notEmpty()
    .withMessage("appointment_ends_at is required")
    .isISO8601()
    .withMessage("appointment_ends_at must be a valid ISO8601 date"),

  body("exclude_appointment_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("exclude_appointment_id must be a positive integer")
    .toInt(),
  handleValidationErrors,
];
const validatorCreateAppointment = [
  body("client_id")
    .notEmpty()
    .withMessage("client_id is required")
    .isInt({ min: 1 })
    .withMessage("client_id must be a positive integer ")
    .toInt(),

  body("staff_id")
    .notEmpty()
    .withMessage("staff_id is required")
    .isInt({ min: 1 })
    .withMessage("staff_id must be a positive integer ")
    .toInt(),

  body("starts_at")
    .notEmpty()
    .withMessage("starts_at is required")
    .isISO8601()
    .withMessage("starts_at must be a valid ISO8601 date"),

  body("service_items")
    .isArray({ min: 1 })
    .withMessage("service_items must be an array with at least one item"),

  body("service_items.*")
    .isInt({ min: 1 })
    .withMessage("each service_id in service_items must be a positive integer")
    .toInt(),

  handleValidationErrors,
];

module.exports = {
  validatorGetAppointmentsByClient,
  validatorGetAppointmentsByStaff,
  validatorGetAppointmentById,
  validatorUpdateAppointmentStatus,
  validatorCancelAppointment,
  validatorUpdateAppointment,
  validatorCheckAppointmentConflict,
  validatorCreateAppointment,
};
