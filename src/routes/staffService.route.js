const express = require("express");

const StaffServiceController = require("../controllers/staffService.controller");

const router = express.Router();

router.post(
  "/assignServiceToStaff",
  StaffServiceController.assignServiceToStaff,
);

module.exports = router;
