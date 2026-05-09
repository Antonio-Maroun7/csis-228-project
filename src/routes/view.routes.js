const express = require("express");
const router = express.Router();

const authView = require("../controllers/views/authView.controller");
const clientView = require("../controllers/views/clientView.controller");
const profileView = require("../controllers/views/profileView.controller");
const adminDashboardView = require("../controllers/views/adminDashboardView.controller");
const adminUserView = require("../controllers/views/adminUserView.controller");
const adminCategoryView = require("../controllers/views/adminCategoryView.controller");
const adminServiceView = require("../controllers/views/adminServiceView.controller");
const adminStaffServiceView = require("../controllers/views/adminStaffServiceView.controller");
const adminAppointmentView = require("../controllers/views/adminAppointmentView.controller");

const {
  requireViewAuth,
  requireViewRole,
} = require("../middleware/viewAuth.middleware");

router.get("/", authView.redirectToLogin);

router.get("/views/login", authView.renderLogin);
router.post("/views/login", authView.login);

router.get("/views/register", authView.renderRegister);
router.post("/views/register", authView.register);

router.get("/views/dashboard", requireViewAuth, authView.renderDashboard);

router.get(
  "/views/client-home",
  requireViewAuth,
  requireViewRole(["client"]),
  clientView.renderClientHome,
);

router.get(
  "/views/services-by-category/:categoryId",
  requireViewAuth,
  requireViewRole(["client"]),
  clientView.renderServicesByCategory,
);

router.get(
  "/views/book-appointment/:serviceId",
  requireViewAuth,
  requireViewRole(["client"]),
  clientView.renderBookAppointment,
);

router.post(
  "/views/book-appointment",
  requireViewAuth,
  requireViewRole(["client"]),
  clientView.bookAppointment,
);

/* ── My Appointments — client view ───────────────────────────── */
router.get(
  "/views/my-appointments",
  requireViewAuth,
  requireViewRole(["client"]),
  clientView.renderMyAppointments,
);

router.post(
  "/views/my-appointments/:id/cancel",
  requireViewAuth,
  requireViewRole(["client"]),
  clientView.cancelMyAppointment,
);

/* ── Profile — shared view for all roles ─────────────────────── */
router.get(
  "/views/profile",
  requireViewAuth,
  requireViewRole(["client"]),
  profileView.renderProfile,
);

router.get(
  "/views/staff-profile",
  requireViewAuth,
  requireViewRole(["staff"]),
  profileView.renderProfile,
);

router.get(
  "/views/admin-profile",
  requireViewAuth,
  requireViewRole(["admin"]),
  profileView.renderProfile,
);

/* ── Admin management views ───────────────────────────────────── */
router.get(
  "/views/admin-dashboard",
  requireViewAuth,
  requireViewRole(["admin"]),
  adminDashboardView.renderAdminDashboard,
);

router.get(
  "/views/manage-users",
  requireViewAuth,
  requireViewRole(["admin"]),
  adminUserView.renderManageUsers,
);

router.get(
  "/views/admin-categories",
  requireViewAuth,
  requireViewRole(["admin"]),
  adminCategoryView.renderAdminCategories,
);

router.post(
  "/views/admin-categories/create",
  requireViewAuth,
  requireViewRole(["admin"]),
  adminCategoryView.adminCreateCategory,
);

router.post(
  "/views/admin-categories/:id/update",
  requireViewAuth,
  requireViewRole(["admin"]),
  adminCategoryView.adminUpdateCategory,
);

router.post(
  "/views/admin-categories/:id/delete",
  requireViewAuth,
  requireViewRole(["admin"]),
  adminCategoryView.adminDeleteCategory,
);

router.get(
  "/views/admin-services",
  requireViewAuth,
  requireViewRole(["admin"]),
  adminServiceView.renderAdminServices,
);

router.post(
  "/views/admin-services/create",
  requireViewAuth,
  requireViewRole(["admin"]),
  adminServiceView.adminCreateService,
);

router.post(
  "/views/admin-services/:id/update",
  requireViewAuth,
  requireViewRole(["admin"]),
  adminServiceView.adminUpdateService,
);

router.post(
  "/views/admin-services/:id/delete",
  requireViewAuth,
  requireViewRole(["admin"]),
  adminServiceView.adminDeleteService,
);

router.get(
  "/views/admin-staff-services",
  requireViewAuth,
  requireViewRole(["admin"]),
  adminStaffServiceView.renderAdminStaffServices,
);

router.post(
  "/views/admin-staff-services/assign",
  requireViewAuth,
  requireViewRole(["admin"]),
  adminStaffServiceView.adminAssignStaffService,
);

router.post(
  "/views/admin-staff-services/:staffId/:serviceId/update",
  requireViewAuth,
  requireViewRole(["admin"]),
  adminStaffServiceView.adminUpdateStaffService,
);

router.post(
  "/views/admin-staff-services/:staffId/:serviceId/delete",
  requireViewAuth,
  requireViewRole(["admin"]),
  adminStaffServiceView.adminDeleteStaffService,
);

router.get(
  "/views/admin-appointments",
  requireViewAuth,
  requireViewRole(["admin"]),
  adminAppointmentView.renderAdminAppointments,
);

router.post(
  "/views/manage-users/create",
  requireViewAuth,
  requireViewRole(["admin"]),
  adminUserView.adminCreateUser,
);

router.post(
  "/views/manage-users/:id/update",
  requireViewAuth,
  requireViewRole(["admin"]),
  adminUserView.adminUpdateUser,
);

router.post(
  "/views/manage-users/:id/delete",
  requireViewAuth,
  requireViewRole(["admin"]),
  adminUserView.adminDeleteUser,
);

router.post(
  "/views/profile/update",
  requireViewAuth,
  profileView.updateProfile,
);

router.post(
  "/views/profile/change-password",
  requireViewAuth,
  profileView.changePassword,
);

router.get("/views/logout", requireViewAuth, authView.logout);
router.get("/views/not-authorized", authView.renderNotAuthorized);

module.exports = router;
