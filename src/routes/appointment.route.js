/**
 * Appointment routes for creation, retrieval, updates, cancellation, and conflict checks.
 */
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
  validatorCreateAppointment,
  validatorGetAppointmentBetweenDates,
} = require("../validators/appointment.validator");
const { authenticate } = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

const router = express.Router();

/**
 * Creates a new appointment.
 */
router.post(
  "/CreateAppointment",
  authenticate,
  authorize(["admin", "client"]),
  authorize.selfByBodyIdOrRoles(["admin"], "client_id"),
  ...validatorCreateAppointment,
  AppointmentController.createAppointment,
);

/**
 * Returns all appointments for a client id.
 */
router.get(
  "/GetAllAppointmentsByClient/:id",
  authenticate,
  authorize(["admin", "client"]),
  authorize.selfByParamIdOrRoles(["admin"], "id"),
  ...validatorGetAppointmentsByClient,
  AppointmentController.getAppointmentsByClient,
);
/**
 * Returns all appointments for a staff id.
 */
router.get(
  "/GetAllAppointmentsByStaff/:id",
  authenticate,
  authorize(["admin", "staff"]),
  authorize.selfByParamIdOrRoles(["admin"], "id"),
  ...validatorGetAppointmentsByStaff,
  AppointmentController.getAppointmentsByStaff,
);
/**
 * Returns one appointment by appointment id.
 */
router.get(
  "/GetAppointmentById/:id",
  authenticate,
  authorize(["admin", "staff", "client"]),
  authorize.selfByAppointmentIdOrRoles(["admin"], "id"),
  ...validatorGetAppointmentById,
  AppointmentController.getAppointmentById,
);
/**
 * Updates status for an appointment.
 */
router.put(
  "/UpdateAppointmentStatus/:id",
  authenticate,
  authorize(["admin", "staff"]),
  authorize.selfByAppointmentIdOrRoles(["admin"], "id"),
  ...validatorUpdateAppointmentStatus,
  AppointmentController.UpdateAppointmentStatus,
);
/**
 * Cancels an appointment by id.
 */
router.put(
  "/CancelAppointment/:id",
  authenticate,
  authorize(["admin", "staff", "client"]),
  authorize.selfByAppointmentIdOrRoles(["admin"], "id"),
  ...validatorCancelAppointment,
  AppointmentController.cancelAppointment,
);
/**
 * Updates appointment details by id.
 */
router.put(
  "/UpdateAppointment/:id",
  authenticate,
  authorize(["admin", "staff", "client"]),
  authorize.selfByAppointmentIdOrRoles(["admin"], "id"),
  ...validatorUpdateAppointment,
  AppointmentController.updateAppointment,
);

/**
 * Checks appointment conflict for a staff/date range request.
 */
router.post(
  "/CheckAppointmentConflict",
  authenticate,
  authorize(["admin", "staff"]),
  authorize.selfByBodyIdOrRoles(["admin"], "staff_id"),
  ...validatorCheckAppointmentConflict,
  AppointmentController.checkAppointmentConflict,
);

/**
 * Returns appointments created between start_date and end_date.
 */
router.get(
  "/GetAppointmentsBetweenDates",
  authenticate,
  authorize(["admin"]),
  ...validatorGetAppointmentBetweenDates,
  AppointmentController.getAppointmentsBetweenDates,
);
module.exports = router;
