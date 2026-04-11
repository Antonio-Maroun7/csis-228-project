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

router.post(
  "/CreateAppointmentItem",
  ...ValidatorCreateAppointmentItem,
  AppointmentItemController.createAppointment,
);

router.get(
  "/GetAppointmentItemById/:id",
  validatorGetAppointmentItemById,
  AppointmentItemController.getAppointmentItemById,
);

router.get(
  "/GetAppointmentItemsByAppointmentId/:id",
  validatorGetAppointmentItemsByAppointmentId,
  AppointmentItemController.getAppointmentItemsByAppointmentId,
);

router.put(
  "/UpdateAppointmentItem/:id",
  validatorUpdateAppointmentItem,
  AppointmentItemController.updateAppointmentItem,
);

router.delete(
  "/DeleteAppointmentItem/:id",
  validatorDeleteAppointmentItem,
  AppointmentItemController.deleteAppointmentItem,
);

module.exports = router;
