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

module.exports = router;
