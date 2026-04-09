/**
 * Validation chains for service endpoints.
 */
const { body, param, validationResult } = require("express-validator");

/**
 * Returns a validation error response when rules fail.
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
 * Validates service id route param.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorServiceId = [
  param("id")
    .notEmpty()
    .withMessage("id is required")
    .isInt({ min: 1 })
    .withMessage("id must be a positive integer "),
  handleValidationErrors,
];

/**
 * Validates create-service payload fields.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorCreateService = [
  body("category_id")
    .notEmpty()
    .withMessage("category_id is required")
    .isInt({ min: 1 })
    .withMessage("category_id must be a positive integer"),

  body("service_name")
    .notEmpty()
    .withMessage("service name is required")
    .isString()
    .withMessage("service_name must be a string ")
    .trim(),

  body("service_description")
    .optional()
    .isString()
    .withMessage("service_description must be a string ")
    .trim(),

  body("service_default_duration_min")
    .notEmpty()
    .withMessage("service_default_duration_min is required")
    .isInt({ min: 1 })
    .withMessage("service_default_duration_min must be a positive integer"),

  body("service_base_price_cents")
    .notEmpty()
    .withMessage("service_base_price_cents is required")
    .isInt({ min: 1 })
    .withMessage("service_base_price_cents must be a positive integer"),

  body("service_is_active")
    .optional()
    .isBoolean()
    .withMessage("service_is_active must be true or false"),
  handleValidationErrors,
];
/**
 * Validates update-service payload fields and service id.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorUpdateService = [
  param("id")
    .notEmpty()
    .withMessage("id is required")
    .isInt({ min: 1 })
    .withMessage("id must be a positive integer"),

  body("category_id")
    .notEmpty()
    .withMessage("category_id is required")
    .isInt({ min: 1 })
    .withMessage("category_id must be a positive integer"),

  body("service_name")
    .notEmpty()
    .withMessage("service_name is required")
    .isString()
    .withMessage("service_name must be a string")
    .trim(),

  body("service_description")
    .optional()
    .isString()
    .withMessage("service_description must be a string")
    .trim(),

  body("service_default_duration_min")
    .notEmpty()
    .withMessage("service_default_duration_min is required")
    .isInt({ min: 1 })
    .withMessage("service_default_duration_min must be a positive integer"),

  body("service_base_price_cents")
    .notEmpty()
    .withMessage("service_base_price_cents is required")
    .isInt({ min: 1 })
    .withMessage("service_base_price_cents must be a positive integer"),
  body("service_is_active")
    .optional()
    .isBoolean()
    .withMessage("service_is_active must be true or false"),
  handleValidationErrors,
];
/**
 * Validates service id used by disable-service endpoint.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorSDisableService = [
  param("id")
    .notEmpty()
    .withMessage("service_id is required")
    .isInt({ min: 1 })
    .withMessage("service_id must be a positive integer"),
];

module.exports = {
  validatorServiceId,
  validatorCreateService,
  validatorUpdateService,
  validatorSDisableService,
};
