/**
 * Validation chains for staff-service assignment endpoints.
 */
const { body, param, validationResult } = require("express-validator");

/**
 * Sends validation errors for invalid staff-service request payloads.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns {void}
 */
const handleVaidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * Validates payload for assigning one service to one staff member.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorAssignSerViceToStaff = [
  body("staff_id")
    .notEmpty()
    .withMessage("id is required")
    .isInt({ min: 1 })
    .withMessage("id must be a positive integer")
    .toInt(),

  body("service_id")
    .notEmpty()
    .withMessage("id is required")
    .isInt({ min: 1 })
    .withMessage("id must be a positive integer")
    .toInt(),

  body("staff_duration_min")
    .notEmpty()
    .withMessage("staff_duration_min is required")
    .isInt({ min: 1 })
    .withMessage("staff_duration_min must be a positive integer")
    .toInt(),

  body("staff_price_cents")
    .notEmpty()
    .withMessage("staff_price_cents is required")
    .isInt({ min: 1 })
    .withMessage("staff_price_cent must be a positive integer")
    .toInt(),
  handleVaidationErrors,
];

/**
 * Validates staff_id route param for staff-service list endpoint.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorGetStaffServices = [
  param("staff_id")
    .notEmpty()
    .withMessage("staff_id is required")
    .isInt({ min: 1 })
    .withMessage("staff_id must a positive integer "),
  handleVaidationErrors,
];

/**
 * Validates service_id route param for staff-by-service endpoint.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorGetStaffByService = [
  param("service_id")
    .notEmpty()
    .withMessage("service_id is required")
    .isInt({ min: 1 })
    .withMessage("service_id must be a positive integer"),
  handleVaidationErrors,
];

/**
 * Validates payload for removing a service assignment from staff.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorRemoveServiceFromStaff = [
  body("staff_id")
    .notEmpty()
    .withMessage("staff_id is required")
    .isInt({ min: 1 })
    .withMessage("staff_id must be a positive integer")
    .toInt(),

  body("service_id")
    .notEmpty()
    .withMessage("service_id is required")
    .isInt({ min: 1 })
    .withMessage("service_id must be a positive integer")
    .toInt(),
  handleVaidationErrors,
];

/**
 * Validates payload for updating staff-specific duration and/or price overrides.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorUpdateStaffService = [
  body("staff_id")
    .notEmpty()
    .withMessage("staff_id is required")
    .isInt({ min: 1 })
    .withMessage("staff_id must be a positive integer")
    .toInt(),

  body("service_id")
    .notEmpty()
    .withMessage("service_id is required")
    .isInt({ min: 1 })
    .withMessage("service_id must be a positive integer")
    .toInt(),

  body("staff_duration_min")
    .optional()
    .isInt({ min: 1 })
    .withMessage("staff_duration_ min must be a positive integer")
    .toInt(),

  body("staff_price_cents")
    .optional()
    .isInt({ min: 1 })
    .withMessage("staff_price_cents must be a positive integer")
    .toInt(),
  body().custom((value) => {
    if (
      value.staff_duration_min === undefined &&
      value.staff_price_cents === undefined
    ) {
      throw new Error(
        "at least one of staff_duration_min or staff_price_cents must be provided",
      );
    }
    return true;
  }),
  handleVaidationErrors,
];

module.exports = {
  validatorAssignSerViceToStaff,
  validatorGetStaffServices,
  validatorGetStaffByService,
  validatorRemoveServiceFromStaff,
  validatorUpdateStaffService,
};
