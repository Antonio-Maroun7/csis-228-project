/**
 * Routes for managing appointment service item records.
 */
const express = require("express");
const AppointmentItemController = require("../controllers/appointment_item.controller");
const {
  ValidatorCreateAppointmentItem,
  validatorGetAppointmentItemById,
  validatorGetAppointmentItemsByAppointmentId,
  validatorUpdateAppointmentItem,
  validatorDeleteAppointmentItem,
} = require("../validators/appointment_item.validator");
const { authenticate } = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");
const router = express.Router();

/**
 * Creates one appointment item.
 */
router.post(
  "/CreateAppointmentItem",
  authenticate,
  authorize(["admin", "staff", "client"]),
  authorize.selfByAppointmentBodyIdOrRoles(["admin"], "appointment_id"),
  ...ValidatorCreateAppointmentItem,
  AppointmentItemController.createAppointment,
);

/**
 * Returns one appointment item by id.
 */
router.get(
  "/GetAppointmentItemById/:id",
  authenticate,
  authorize(["admin", "staff", "client"]),
  authorize.selfByAppointmentItemIdOrRoles(["admin"], "id"),
  validatorGetAppointmentItemById,
  AppointmentItemController.getAppointmentItemById,
);

/**
 * Returns all items belonging to one appointment id.
 */
router.get(
  "/GetAppointmentItemsByAppointmentId/:id",
  authenticate,
  authorize(["admin", "staff", "client"]),
  authorize.selfByAppointmentIdOrRoles(["admin"], "id"),
  validatorGetAppointmentItemsByAppointmentId,
  AppointmentItemController.getAppointmentItemsByAppointmentId,
);

/**
 * Updates one appointment item by id.
 */
router.put(
  "/UpdateAppointmentItem/:id",
  authenticate,
  authorize(["admin", "staff", "client"]),
  authorize.selfByAppointmentItemIdOrRoles(["admin"], "id"),
  validatorUpdateAppointmentItem,
  AppointmentItemController.updateAppointmentItem,
);

/**
 * Deletes one appointment item by id.
 */
router.delete(
  "/DeleteAppointmentItem/:id",
  authenticate,
  authorize(["admin", "staff", "client"]),
  authorize.selfByAppointmentItemIdOrRoles(["admin"], "id"),
  validatorDeleteAppointmentItem,
  AppointmentItemController.deleteAppointmentItem,
);

module.exports = router;
