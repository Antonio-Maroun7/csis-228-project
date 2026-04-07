const express = require("express");
const AppointmentController = require("../controllers/appointment.controller");
const {
  validatorGetAppointmentsByClient,
  validatorGetAppointmentsByStaff,
  validatorGetAppointmentById,
  validatorUpdateAppointmentStatus,
  validatorCancelAppointment,
  validatorUpdateAppointment,
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
router.put(
  "/UpdateAppointmentStatus/:id",
  validatorUpdateAppointmentStatus,
  AppointmentController.UpdateAppointmentStatus,
);
router.put(
  "/CancelAppointment/:id",
  validatorCancelAppointment,
  AppointmentController.cancelAppointment,
);
router.put(
  "/UpdateAppointment/:id",
  validatorUpdateAppointment,
  AppointmentController.updateAppointment,
);
module.exports = router;
