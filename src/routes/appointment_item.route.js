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
const router = express.Router();

/**
 * Creates one appointment item.
 */
router.post(
  "/CreateAppointmentItem",
  ...ValidatorCreateAppointmentItem,
  AppointmentItemController.createAppointment,
);

/**
 * Returns one appointment item by id.
 */
router.get(
  "/GetAppointmentItemById/:id",
  validatorGetAppointmentItemById,
  AppointmentItemController.getAppointmentItemById,
);

/**
 * Returns all items belonging to one appointment id.
 */
router.get(
  "/GetAppointmentItemsByAppointmentId/:id",
  validatorGetAppointmentItemsByAppointmentId,
  AppointmentItemController.getAppointmentItemsByAppointmentId,
);

/**
 * Updates one appointment item by id.
 */
router.put(
  "/UpdateAppointmentItem/:id",
  validatorUpdateAppointmentItem,
  AppointmentItemController.updateAppointmentItem,
);

/**
 * Deletes one appointment item by id.
 */
router.delete(
  "/DeleteAppointmentItem/:id",
  validatorDeleteAppointmentItem,
  AppointmentItemController.deleteAppointmentItem,
);

module.exports = router;
