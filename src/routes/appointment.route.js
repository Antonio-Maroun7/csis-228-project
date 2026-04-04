const express = require("express");
const AppointmentController = require("../controllers/appointment.controller");
const {
  validatorGetAppointmentsByClient,
} = require("../validators/appointment.validator");

const router = express.Router();

router.get(
  "/GetAllAppointments/:id",
  validatorGetAppointmentsByClient,
  AppointmentController.getAppointmentsByClient,
);

module.exports = router;
