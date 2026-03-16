const express = require("express");
const StaffServiceController = require("../controllers/staffService.controller");
const {
  validatorAssignSerViceToStaff,
} = require("../validators/staffService.validator");
const router = express.Router();

router.put("/updateStaffService", StaffServiceController.updateStaffServices);

router.get("/getAllStaffServices", StaffServiceController.getAllStaffServices);

router.delete(
  "/removeServiceFromStaff",
  StaffServiceController.deleteServiceFromStaff,
);
router.get(
  "/getStaffByService/:service_id",
  StaffServiceController.getStaffByService,
);
router.get(
  "/getStaffServices/:staff_id",
  StaffServiceController.getStaffServices,
);
router.post(
  "/assignServiceToStaff",
  validatorAssignSerViceToStaff,
  StaffServiceController.assignServiceToStaff,
);

module.exports = router;
