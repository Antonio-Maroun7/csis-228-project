/**
 * Validation chains for user endpoints.
 */
const { body, param, validationResult } = require("express-validator");

/**
 * Sends a 400 validation response when request data is invalid.
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
 * Validates route param id for user id based endpoints.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorUserId = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("id must be a positife integer")
    .notEmpty()
    .withMessage("id is required"),
  handleValidationErrors,
];

/**
 * Validates user update payload and required id param.
 * @type {Array<import("express").RequestHandler>}
 */
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

/**
 * Validates route param user_email.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorUserEmail = [
  param("user_email")
    .notEmpty()
    .withMessage("user_email is required")
    .isEmail()
    .withMessage("invalid user_email format")
    .normalizeEmail(),
  handleValidationErrors,
];
/**
 * Validates route param id for delete operation.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorDeleteUser = [
  param("id")
    .notEmpty()
    .withMessage("id is required ")
    .isInt({ min: 1 })
    .withMessage("id must be a positive integer"),
  handleValidationErrors,
];
/**
 * Validates password change request including id param and newpassword constraints.
 * @type {Array<import("express").RequestHandler>}
 */

const validateChangePasswordByEmail = [
  param("user_email")
    .notEmpty()
    .withMessage("user_email is required")
    .isEmail()
    .withMessage("invalid user_email format")
    .normalizeEmail(),

  body("currentPassword")
    .notEmpty()
    .withMessage("current password is required"),

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
    .matches(/[!@#$%^&*(),.?\":{}|<>]/)
    .withMessage("new password must contain at least one special character"),
  handleValidationErrors,
];
module.exports = {
  validatorUserId,

  validatorUpdateUser,
  validatorUserEmail,
  validatorDeleteUser,

  validateChangePasswordByEmail,
};
