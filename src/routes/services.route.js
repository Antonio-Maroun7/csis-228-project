const express = require("express");
const servicesControler = require("../controllers/services.controller");
const {
  validatorServiceId,
  validatorCreateService,
} = require("../validators/service.validator");
const ServiceController = require("../controllers/services.controller");

const router = express.Router();
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
router.get("/", servicesControler.getAllServices);
module.exports = router;
