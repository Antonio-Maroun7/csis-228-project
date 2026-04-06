const express = require("express");
const AppointmentController = require("../controllers/appointment.controller");
const {
  validatorGetAppointmentsByClient,
  validatorGetAppointmentsByStaff
} = require("../validators/appointment.validator");

const router = express.Router();

router.get(
  "/GetAllAppointmentsByClient/:id",
  validatorGetAppointmentsByClient,
  AppointmentController.getAppointmentsByClient,
);
router.get(
  "/GetAllAppointmentsByStaff/:id",
  validatorGetAppointmentsByStaff,
  AppointmentController.getAppointmentsByStaff,
);

module.exports = router;
