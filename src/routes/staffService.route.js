/**
 * Routes for assigning services to staff members and managing staff overrides.
 */
const express = require("express");
const StaffServiceController = require("../controllers/staffService.controller");
const {
  validatorAssignSerViceToStaff,
  validatorGetStaffServices,
  validatorGetStaffByService,
  validatorRemoveServiceFromStaff,
  validatorUpdateStaffService,
} = require("../validators/staffService.validator");
const router = express.Router();

router.put(
  "/updateStaffService",
  validatorUpdateStaffService,
  StaffServiceController.updateStaffServices,
);

router.get("/getAllStaffServices", StaffServiceController.getAllStaffServices);

router.delete(
  "/removeServiceFromStaff",
  ...validatorRemoveServiceFromStaff,
  StaffServiceController.deleteServiceFromStaff,
);
router.get(
  "/getStaffByService/:service_id",
  ...validatorGetStaffByService,
  StaffServiceController.getStaffByService,
);
router.get(
  "/getStaffServices/:staff_id",
  ...validatorGetStaffServices,
  StaffServiceController.getStaffServices,
);
router.post(
  "/assignServiceToStaff",
  ...validatorAssignSerViceToStaff,
  StaffServiceController.assignServiceToStaff,
);

module.exports = router;
