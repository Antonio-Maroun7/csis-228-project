const { body, param, validationResult } = require("express-validator");

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
    .withMessage("password must be at least characters")
    .matches(/[A-B]/)
    .withMessage("password must contain at least one uppercase letter")
    .matches(/[a-b]/)
    .withMessage("password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage(" password must contain at least one special character"),

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
const validatorDeleteUser = [
  param("id")
    .notEmpty()
    .withMessage("id is required ")
    .isInt({ min: 1 })
    .withMessage("id must be a positive integer"),
  handleValidationErrors,
];
const validateChangePassword = [
  param("id")
    .notEmpty()
    .withMessage("id is required ")
    .isInt({ min: 1 })
    .withMessage("id must be a positive integer"),

  body("newpassword")
    .notEmpty()
    .withMessage("new password is required")
    .isLength({ min: 6 })
    .withMessage("new password must be at least 6 characters long")
    .matches(/[A-Z]/)
    .withMessage("new password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("new password myst contain at least one lower case letter")
    .matches(/[0-9]/)
    .withMessage("new password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("new password must contain at least one special character"),
  handleValidationErrors,
];
module.exports = {
  validatorUserId,
  validatorCreateUser,
  validatorUpdateUser,
  validatorUserEmail,
  validatorDeleteUser,
  validateChangePassword,
};
