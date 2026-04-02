const { body, param, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
const validatorCategoryId = [
  param("id")
    .notEmpty()
    .withMessage("category_id is required")
    .isInt({ min: 1 })
    .withMessage("category_id must be a positive integer "),
  handleValidationErrors,
];
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
