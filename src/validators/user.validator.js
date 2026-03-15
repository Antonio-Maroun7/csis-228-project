const { body, param, query, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validatorUserId = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("id must be a positife integer")
    .notEmpty()
    .withMessage("id is required"),
  handleValidationErrors,
];

const validatorCreateUser = [
  body("user_fullname")
    .notEmpty()
    .withMessage("user_fullname is required")
    .isString()
    .withMessage("user_fullname must be a string ")
    .trim(),

  body("user_email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("user_password")
    .notEmpty()
    .withMessage("user_password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least characters"),

  body("user_role")
    .optional()
    .isIn(["client", "staff", "admin"])
    .withMessage("user_role must be a client , staff or admin "),

  body("user_phone")
    .isString()
    .withMessage("user_phone must be a string")
    .trim()
    .optional(),

  body("user_is_active")
    .isBoolean()
    .withMessage("user_is_active must be true or false")
    .optional(),
  handleValidationErrors,
];

const validatorUpdateUser = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("id must be a positive integer")
    .notEmpty()
    .withMessage("id is required"),

  body("user_fullname")
    .notEmpty()
    .withMessage("user_fullname is required")
    .trim()
    .isString()
    .withMessage("user_fullname must be a string"),

  body("user_email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("user_role")
    .optional()
    .isIn(["client", "staff", "admin"])
    .withMessage("user_role must be client,staff , or admin"),

  body("user_phone")
    .optional()
    .isString()
    .withMessage("user_phone must be a string")
    .trim(),

  body("user_is_active")
    .optional()
    .isBoolean()
    .withMessage("user_is_active must be true or false"),

  handleValidationErrors,
];

const validatorUserEmail = [
  param("user_email")
    .notEmpty()
    .withMessage("user_email is required")
    .isEmail()
    .withMessage("invalid user_email format")
    .normalizeEmail(),
  handleValidationErrors,
];
module.exports = {
  validatorUserId,
  validatorCreateUser,
  validatorUpdateUser,
  validatorUserEmail,
};
