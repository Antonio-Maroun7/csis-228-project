const express = require("express");
const router = express.Router();

const viewController = require("../controllers/view.controller");

const {
  requireViewAuth,
  requireViewRole,
} = require("../middleware/viewAuth.middleware");

/**
 * Public pages
 */
router.get("/", viewController.redirectToLogin);
router.get("/views/login", viewController.renderLogin);
router.post("/views/login", viewController.login);

router.get("/views/register", viewController.renderRegister);
router.post("/views/register", viewController.register);

router.get("/views/dashboard", requireViewAuth, viewController.renderDashboard);

router.get(
  "/views/client-home",
  requireViewAuth,
  requireViewRole(["client"]),
  viewController.renderClientHome,
);

module.exports = router;
