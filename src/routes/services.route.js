const express = require("express");
const ServiceController = require("../controllers/service.controller");
const {
  validatorServiceId,
  validatorCreateService,
  validatorUpdateService,
  validatorSDisableService,
} = require("../validators/service.validator");

const router = express.Router();

router.get(
  "/getServicesByCategory/:id",
  ServiceController.getServicesByCategory,
);
router.put(
  "/disableSevice/:id",
  validatorSDisableService,
  ServiceController.disabledService,
);
router.put(
  "/updateService/:id",
  validatorUpdateService,
  ServiceController.updateService,
);
router.post(
  "/createService",
  validatorCreateService,
  ServiceController.createService,
);
router.get(
  "/ServiceById/:id",
  validatorServiceId,
  ServiceController.getServiceById,
);
router.get("/", ServiceController.getAllServices);
module.exports = router;
