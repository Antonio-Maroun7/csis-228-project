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

/* ── My Appointments — client view ───────────────────────────── */
router.get(
  "/views/my-appointments",
  requireViewAuth,
  requireViewRole(["client"]),
  viewController.renderMyAppointments,
);

router.post(
  "/views/my-appointments/:id/cancel",
  requireViewAuth,
  requireViewRole(["client"]),
  viewController.cancelMyAppointment,
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

/* ── Admin management views ───────────────────────────────────── */
router.get(
  "/views/admin-dashboard",
  requireViewAuth,
  requireViewRole(["admin"]),
  viewController.renderAdminDashboard,
);

router.get(
  "/views/manage-users",
  requireViewAuth,
  requireViewRole(["admin"]),
  viewController.renderManageUsers,
);

router.get(
  "/views/admin-categories",
  requireViewAuth,
  requireViewRole(["admin"]),
  viewController.renderAdminCategories,
);

router.post(
  "/views/admin-categories/create",
  requireViewAuth,
  requireViewRole(["admin"]),
  viewController.adminCreateCategory,
);

router.post(
  "/views/admin-categories/:id/update",
  requireViewAuth,
  requireViewRole(["admin"]),
  viewController.adminUpdateCategory,
);

router.post(
  "/views/admin-categories/:id/delete",
  requireViewAuth,
  requireViewRole(["admin"]),
  viewController.adminDeleteCategory,
);

router.get(
  "/views/admin-services",
  requireViewAuth,
  requireViewRole(["admin"]),
  viewController.renderAdminServices,
);

router.get(
  "/views/admin-staff-services",
  requireViewAuth,
  requireViewRole(["admin"]),
  viewController.renderAdminStaffServices,
);

router.get(
  "/views/admin-appointments",
  requireViewAuth,
  requireViewRole(["admin"]),
  viewController.renderAdminAppointments,
);

router.post(
  "/views/manage-users/create",
  requireViewAuth,
  requireViewRole(["admin"]),
  viewController.adminCreateUser,
);

router.post(
  "/views/manage-users/:id/update",
  requireViewAuth,
  requireViewRole(["admin"]),
  viewController.adminUpdateUser,
);

router.post(
  "/views/manage-users/:id/delete",
  requireViewAuth,
  requireViewRole(["admin"]),
  viewController.adminDeleteUser,
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
