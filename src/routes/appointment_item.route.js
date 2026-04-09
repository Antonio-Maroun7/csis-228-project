/**
 * Routes for managing appointment service item records.
 */
const express = require("express");
const AppointmentItemController = require("../controllers/appointment_item.controller");
const {
  ValidatorCreateAppointmentItem,
} = require("../validators/appointment_item.validator");
const router = express.Router();

router.post(
  "/CreateAppointmentItem",
  ...ValidatorCreateAppointmentItem,
  AppointmentItemController.createAppointment,
);

module.exports = router;
