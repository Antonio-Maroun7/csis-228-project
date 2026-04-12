/**
 * Routes for assigning services to staff members and managing staff overrides.
 */
const express = require("express");
const StaffServiceController = require("../controllers/staffService.controller");
const { authenticate } = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");
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
  authenticate,
  authorize(["admin", "staff"]),
  authorize.selfByBodyIdOrRoles(["admin"], "staff_id"),
  validatorUpdateStaffService,
  StaffServiceController.updateStaffServices,
);

router.get(
  "/getAllStaffServices",
  authenticate,
  authorize(["admin"]),
  StaffServiceController.getAllStaffServices,
);

router.delete(
  "/removeServiceFromStaff",
  authenticate,
  authorize(["admin"]),
  ...validatorRemoveServiceFromStaff,
  StaffServiceController.deleteServiceFromStaff,
);
router.get(
  "/getStaffByService/:service_id",
  authenticate,
  authorize(["admin", "staff", "client"]),
  ...validatorGetStaffByService,
  StaffServiceController.getStaffByService,
);
router.get(
  "/getStaffServices/:staff_id",
  ...validatorGetStaffServices,
  authenticate,
  authorize(["admin", "staff"]),
  authorize.selfByParamIdOrRoles(["admin"], "staff_id"),
  StaffServiceController.getStaffServices,
);

router.post(
  "/assignServiceToStaff",
  authenticate,
  authorize(["admin"]),
  ...validatorAssignSerViceToStaff,
  StaffServiceController.assignServiceToStaff,
);

module.exports = router;
