const express = require("express");
const AppointmentController = require("../controllers/appointment.controller");
const {
  validatorGetAppointmentsByClient,
  validatorGetAppointmentsByStaff,
  validatorGetAppointmentById,
  validatorUpdateAppointmentStatus,
  validatorCancelAppointment,
  validatorUpdateAppointment,
  validatorCheckAppointmentConflict,
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

router.get(
  "/CheckAppointmentConflict",
  validatorCheckAppointmentConflict,
  AppointmentController.checkAppointmentConflict,
);
module.exports = router;
