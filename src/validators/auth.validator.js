const { body, param, validationResult } = require("express-validator");
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

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

const validatorLoginUser = [
  body("user_email")
    .notEmpty()
    .withMessage("user_email is required")
    .isEmail()
    .withMessage("Invalid email format").normalizeEmail,

  body("user_password")
    .notEmpty()
    .withMessage("user_password is required")
    .withMessage("user_password is required"),
  ,
  handleValidationErrors,
];
module.exports = { validatorRegisterUser, validatorLoginUser };
