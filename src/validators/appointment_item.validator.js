/**
 * Validation chains for appointment item endpoints.
 */
const { body, param, validationResult } = require("express-validator");
/**
 * Handles validation error responses for appointment item requests.
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
 * Validates payload fields for creating an appointment item.
 * @type {Array<import("express").RequestHandler>}
 */
const ValidatorCreateAppointmentItem = [
  body("appointment_id")
    .notEmpty()
    .withMessage("appointment_id is required")
    .isInt({ min: 1 })
    .withMessage("appointment_id must be a positive integer")
    .toInt(),

  body("service_id")
    .notEmpty()
    .withMessage("service_id is required")
    .isInt({ min: 1 })
    .withMessage("service_id must be a positive integer")
    .toInt(),

  body("appointment_duration_min")
    .notEmpty()
    .withMessage("appointment_duration_min is required")
    .isInt({ min: 1 })
    .withMessage("appointment_duration_min must be a positive integer")
    .toInt(),

  body("appointment_price_cents")
    .notEmpty()
    .withMessage("appointment_price_cents is required")
    .isInt({ min: 0 })
    .withMessage("appointment_price_cents must be a positive integer")
    .toInt(),
  handleValidationErrors,
];

/**
 * Validates route param id for fetching one appointment item.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorGetAppointmentItemById = [
  param("id")
    .notEmpty()
    .withMessage("appointment_item_id is required")
    .isInt({ min: 1 })
    .withMessage("appointment_item_id must be a positive integer")
    .toInt(),
  handleValidationErrors,
];

/**
 * Validates route param id for listing items by appointment id.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorGetAppointmentItemsByAppointmentId = [
  param("id")
    .notEmpty()
    .withMessage("appointment_id is required")
    .isInt({ min: 1 })
    .withMessage("appointment_id must be a positive integer")
    .toInt(),
  handleValidationErrors,
];

/**
 * Validates route param id and body payload for appointment item updates.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorUpdateAppointmentItem = [
  param("id")
    .notEmpty()
    .withMessage("appointment_item_id is required")
    .isInt({ min: 1 })
    .withMessage("appointment_item_id must be a positive integer")
    .toInt(),

  body("service_id")
    .notEmpty()
    .withMessage("service_id is required")
    .isInt({ min: 1 })
    .withMessage("service_id must be a positive integer")
    .toInt(),

  body("appointment_duration_min")
    .notEmpty()
    .withMessage("appointment_duration_min is required")
    .isInt({ min: 1 })
    .withMessage("appointment_duration_min must be a positive integer")
    .toInt(),

  body("appointment_price_cents")
    .notEmpty()
    .withMessage("appointment_price_cents is required")
    .isInt({ min: 0 })
    .withMessage("appointment_price_cents must be a positive integer")
    .toInt(),
  handleValidationErrors,
];

/**
 * Validates route param id for appointment item deletion.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorDeleteAppointmentItem = [
  param("id")
    .notEmpty()
    .withMessage("appointment_item_id is required")
    .isInt({ min: 1 })
    .withMessage("appointment_item_id must be a positive integer")
    .toInt(),
  handleValidationErrors,
];

module.exports = {
  ValidatorCreateAppointmentItem,
  validatorGetAppointmentItemById,
  validatorGetAppointmentItemsByAppointmentId,
  validatorUpdateAppointmentItem,
  validatorDeleteAppointmentItem,
};
