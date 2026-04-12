/**
 * Service routes for CRUD-style operations and category-based lookups.
 */
const express = require("express");
const ServiceController = require("../controllers/service.controller");
const {
  validatorServiceId,
  validatorCreateService,
  validatorUpdateService,
  validatorSDisableService,
} = require("../validators/service.validator");
const { authenticate } = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

const router = express.Router();

router.get(
  "/getServicesByCategory/:id",
  authenticate,
  authorize(["admin", "staff", "client"]),
  ...validatorServiceId,
  ServiceController.getServicesByCategory,
);
router.put(
  "/disableService/:id",
  authenticate,
  authorize(["admin"]),
  ...validatorSDisableService,
  ServiceController.disabledService,
);
router.put(
  "/updateService/:id",
  authenticate,
  authorize(["admin"]),
  ...validatorUpdateService,
  ServiceController.updateService,
);
router.post(
  "/createService",
  authenticate,
  authorize(["admin"]),
  ...validatorCreateService,
  ServiceController.createService,
);
router.get(
  "/ServiceById/:id",
  authenticate,
  authorize(["admin", "staff", "client"]),
  ...validatorServiceId,
  ServiceController.getServiceById,
);
router.get(
  "/getAllServices",
  authenticate,
  authorize(["admin", "staff", "client"]),
  ServiceController.getAllServices,
);
module.exports = router;
