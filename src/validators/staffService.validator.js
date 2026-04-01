const { body, param, validationResult } = require("express-validator");

const handleVaidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validatorAssignSerViceToStaff = [
  body("staff_id")
    .notEmpty()
    .withMessage("id is required")
    .isInt({ min: 1 })
    .withMessage("id must be a positive integer")
    .toInt(),

  body("service_id")
    .notEmpty()
    .withMessage("id is required")
    .isInt({ min: 1 })
    .withMessage("id must be a positive integer")
    .toInt(),

  body("staff_duration_min")
    .optional()
    .isInt({ min: 1 })
    .withMessage("staff_duration_min must be a positive integer")
    .toInt(),

  body("staff_price_cents")
    .optional()
    .isInt({ min: 1 })
    .withMessage("staff_price_cent must be a positive integer")
    .toInt(),
  handleVaidationErrors,
];

const validatorGetStaffServices = [
  param("staff_id")
    .notEmpty()
    .withMessage("staff_id is required")
    .isInt({ min: 1 })
    .withMessage("staff_id must a positive integer "),
  handleVaidationErrors,
];

const validatorGetStaffByService = [
  param("service_id")
    .notEmpty()
    .withMessage("service_id is required")
    .isInt({ min: 1 })
    .withMessage("service_id must be a positive integer"),
  handleVaidationErrors,
];

const validatorRemoveServiceFromStaff = [
  body("staff_id")
    .notEmpty()
    .withMessage("staff_id is required")
    .isInt({ min: 1 })
    .withMessage("staff_id must be a positive integer")
    .toInt(),

  body("service_id")
    .notEmpty()
    .withMessage("service_id is required")
    .isInt({ min: 1 })
    .withMessage("service_id must be a positive integer")
    .toInt(),
  handleVaidationErrors,
];

const validatorUpdateStaffService = [
  body("staff_id")
    .notEmpty()
    .withMessage("staff_id is required")
    .isInt({ min: 1 })
    .withMessage("staff_id must be a positive integer")
    .toInt(),

  body("service_id")
    .notEmpty()
    .withMessage("service_id is required")
    .isInt({ min: 1 })
    .withMessage("service_id must be a positive integer")
    .toInt(),

  body("staff_duration_min")
    .optional()
    .isInt({ min: 1 })
    .withMessage("staff_duration_ min must be a positive integer")
    .toInt(),

  body("staff_price_cents")
    .optional()
    .isInt({ min: 1 })
    .withMessage("staff_price_cents must be a positive integer")
    .toInt(),
  body().custom((value) => {
    if (
      value.staff_duration_min === undefined &&
      value.staff_price_cents === undefined
    ) {
      throw new Error(
        "at least one of staff_duration_min or staff_price_cents must be provided",
      );
    }
    return true;
  }),
  handleVaidationErrors,
];

module.exports = {
  validatorAssignSerViceToStaff,
  validatorGetStaffServices,
  validatorGetStaffByService,
  validatorRemoveServiceFromStaff,
  validatorUpdateStaffService,
};
