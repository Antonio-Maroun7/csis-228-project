const { body, param, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validatorServiceId = [
  param("id")
    .notEmpty()
    .withMessage("id is required")
    .isInt({ min: 1 })
    .withMessage("id must be a positive integer "),
  handleValidationErrors,
];
module.exports = { validatorServiceId };
