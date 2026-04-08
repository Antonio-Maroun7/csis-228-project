const { body, param, validationResult } = require("express-validator");
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const ValidatorCreateAppointmentItem = [
  body("appointment_id")
    .notEmpty()
    .withMessage("appointment_id is required")
    .isInt({ min: 1 })
    .withMessage("appointment_id must be a positive integer")
    .toInt(),

  body("service_id")
    .notEmpty()
    .withMessage("service_id is required")
    .isInt({ min: 1 })
    .withMessage("service_id must be a positive integer")
    .toInt(),

  body("appointment_duration_min")
    .notEmpty()
    .withMessage("appointment_duration_min is required")
    .isInt({ min: 1 })
    .withMessage("appointment_duration_min must be a positive integer")
    .toInt(),

  body("appointment_price_cents")
    .notEmpty()
    .withMessage("appointment_price_cents is required")
    .isInt({ min: 0 })
    .withMessage("appointment_price_cents must be a positive integer")
    .toInt(),
  handleValidationErrors,
];

module.exports = { ValidatorCreateAppointmentItem };
