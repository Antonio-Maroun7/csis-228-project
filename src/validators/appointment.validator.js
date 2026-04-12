/**
 * Validation chains for appointment endpoints.
 */
const { body, param, validationResult } = require("express-validator");

/**
 * Handles express-validator errors for appointment requests.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns {void}
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * Validates client id param for client appointment listing endpoint.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorGetAppointmentsByClient = [
  param("id")
    .notEmpty()
    .withMessage("client_id is required")
    .isInt({ min: 1 })
    .withMessage("client_id must be a positive integer "),
  handleValidationErrors,
];

/**
 * Validates staff id param for staff appointment listing endpoint.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorGetAppointmentsByStaff = [
  param("id")
    .notEmpty()
    .withMessage("staff_id is required")
    .isInt({ min: 1 })
    .withMessage("staff_id must be a positive integer "),
  handleValidationErrors,
];
/**
 * Validates appointment id param.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorGetAppointmentById = [
  param("id")
    .notEmpty()
    .withMessage("appointment_id is required")
    .isInt({ min: 1 })
    .withMessage("appointment_id must be a positive integer "),
  handleValidationErrors,
];

/**
 * Validates appointment id and status payload for status update endpoint.
 * @type {Array<import("express").RequestHandler>}
 */
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

/**
 * Validates appointment id for cancellation endpoint.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorCancelAppointment = [
  param("id")
    .notEmpty()
    .withMessage("appointment_id is required")
    .isInt({ min: 1 })
    .withMessage("appointment_id must be a positive integer "),
  handleValidationErrors,
];
/**
 * Validates appointment update payload and id param.
 * @type {Array<import("express").RequestHandler>}
 */
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

/**
 * Validates payload used for staff availability conflict checking.
 * @type {Array<import("express").RequestHandler>}
 */
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
/**
 * Validates payload used to create an appointment.
 * @type {Array<import("express").RequestHandler>}
 */
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

/**
 * Validates date range payload for appointment retrieval between dates.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorGetAppointmentBetweenDates = [
  body("start_date")
    .notEmpty()
    .withMessage("start_date is required")
    .isISO8601()
    .withMessage("start_date must be a valid ISO8601 date"),
  body("end_date")
    .notEmpty()
    .withMessage("end_date is required")
    .isISO8601()
    .withMessage("end_date must be a valid ISO8601 date"),
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
  validatorGetAppointmentBetweenDates,
};
