const express = require("express");
const router = express.Router();

const viewController = require("../controllers/view.controller");

const {
  requireViewAuth,
  requireViewRole,
} = require("../middleware/viewAuth.middleware");

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

router.get(
  "/views/services-by-category/:categoryId",
  requireViewAuth,
  requireViewRole(["client"]),
  viewController.renderServicesByCategory,
);

router.get(
  "/views/book-appointment/:serviceId",
  requireViewAuth,
  requireViewRole(["client"]),
  viewController.renderBookAppointment,
);

router.post(
  "/views/book-appointment",
  requireViewAuth,
  requireViewRole(["client"]),
  viewController.bookAppointment,
);

/* ── Profile — shared view for all roles ─────────────────────── */
router.get(
  "/views/profile",
  requireViewAuth,
  requireViewRole(["client"]),
  viewController.renderProfile,
);

router.get(
  "/views/staff-profile",
  requireViewAuth,
  requireViewRole(["staff"]),
  viewController.renderProfile,
);

router.get(
  "/views/admin-profile",
  requireViewAuth,
  requireViewRole(["admin"]),
  viewController.renderProfile,
);

router.post(
  "/views/profile/update",
  requireViewAuth,
  viewController.updateProfile,
);

router.post(
  "/views/profile/change-password",
  requireViewAuth,
  viewController.changePassword,
);

router.get("/views/logout", requireViewAuth, viewController.logout);
router.get("/views/not-authorized", viewController.renderNotAuthorized);

module.exports = router;
