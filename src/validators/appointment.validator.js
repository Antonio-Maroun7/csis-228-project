const { body, param, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validatorGetAppointmentsByClient = [
  param("id")
    .notEmpty()
    .withMessage("client_id is required")
    .isInt({ min: 1 })
    .withMessage("client_id must be a positive integer "),
  handleValidationErrors,
];
module.exports = {
  validatorGetAppointmentsByClient,
};
