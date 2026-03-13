const { body, param, querry, validationResult } = require("express-validator");

const validatorUserId = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("id must be a positife integer")
    .notEmpty()
    .withMessage("id is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validatorUserId };
