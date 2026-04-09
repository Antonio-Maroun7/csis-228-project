/**
 * Validation chains for category endpoint payloads and params.
 */
const { body, param, validationResult } = require("express-validator");

/**
 * Sends a 400 response when validation rules fail.
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
 * Validates category id route param.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorCategoryId = [
  param("id")
    .notEmpty()
    .withMessage("category_id is required")
    .isInt({ min: 1 })
    .withMessage("category_id must be a positive integer "),
  handleValidationErrors,
];
/**
 * Validates category creation body fields.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorCreateCategory = [
  body("category_name")
    .notEmpty()
    .withMessage("category_name is required")
    .isString()
    .withMessage("category_name must be a string")
    .trim(),

  body("category_description")
    .optional()
    .isString()
    .withMessage("category_description must be a string")
    .trim(),

  body("category_is_active")
    .optional()
    .isBoolean()
    .withMessage("category_is_active must be a boolean"),
  handleValidationErrors,
];

/**
 * Validates category update body fields and id param.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorUpdateCategory = [
  param("id")
    .notEmpty()
    .withMessage("category_id is required")
    .isInt({ min: 1 })
    .withMessage("category_id must be a positive integer "),

  body("category_name")
    .notEmpty()
    .withMessage("category_name is required")
    .isString()
    .withMessage("category_name must be a string")
    .trim(),

  body("category_description")
    .optional()
    .isString()
    .withMessage("category_description must be a string")
    .trim(),
  body("category_is_active")
    .optional()
    .isBoolean()
    .withMessage("category_is_active must be a boolean"),
  handleValidationErrors,
];

module.exports = {
  validatorCategoryId,
  validatorCreateCategory,
  validatorUpdateCategory,
};
