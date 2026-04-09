/**
 * Validation chains for authentication endpoints.
 */
const { body, param, validationResult } = require("express-validator");
/**
 * Sends 400 response when express-validator found invalid fields.
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
 * Validates register payload fields: fullname, email, password, optional role/phone/is_active.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorRegisterUser = [
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
    .matches(/[A-Z]/)
    .withMessage("password must contain at least one uppercase letter")
    .matches(/[a-z]/)
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

/**
 * Validates login payload fields: user_email and user_password.
 * @type {Array<import("express").RequestHandler>}
 */
const validatorLoginUser = [
  body("user_email")
    .notEmpty()
    .withMessage("user_email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("user_password").notEmpty().withMessage("user_password is required"),
  handleValidationErrors,
];
module.exports = { validatorRegisterUser, validatorLoginUser };
