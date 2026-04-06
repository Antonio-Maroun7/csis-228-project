const express = require("express");
const AppointmentController = require("../controllers/appointment.controller");
const {
  validatorGetAppointmentsByClient,
  validatorGetAppointmentsByStaff,
  validatorGetAppointmentById,
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
router.get(
  "/GetAppointmentById/:id",
  validatorGetAppointmentById,
  AppointmentController.getAppointmentById,
);

module.exports = router;
