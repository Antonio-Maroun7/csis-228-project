"use strict";

const UserService = require("../../services/user.service");
const CategoryService = require("../../services/category.service");
const ServicesService = require("../../services/services.service");
const AppointmentService = require("../../services/appointment.service");
const { buildFeedbackState } = require("../../utils/views/feedback.util");
const {
  getFirstName,
  getLoggedInUser,
} = require("../../utils/views/userView.util");
const {
  decorateAdminAppointmentsForView,
} = require("../../utils/views/appointmentView.mapper");

async function renderAdminDashboard(req, res) {
  try {
    const user = await getLoggedInUser(req);
    const firstName = getFirstName(user);

    const [allUsers, allCategories, allServices, allAppointments] =
      await Promise.all([
        UserService.getAllUsers(),
        CategoryService.getAllCategories(),
        ServicesService.getServices(),
        AppointmentService.getAllAppointments(),
      ]);

    const stats = {
      totalUsers: allUsers.length,
      totalCategories: allCategories.length,
      totalServices: allServices.length,
      totalAppointments: allAppointments.length,
      pendingAppointments: allAppointments.filter(
        (a) => (a.appointment_status || a.status) === "pending",
      ).length,
      completedAppointments: allAppointments.filter(
        (a) => (a.appointment_status || a.status) === "completed",
      ).length,
    };

    const recentAppointments = decorateAdminAppointmentsForView(
      allAppointments.slice(0, 10),
    );

    return res.render("admin/admin-dashboard", {
      title: "Admin Dashboard",
      user,
      firstName,
      role: "admin",
      activePage: "admin-dashboard",
      breadcrumbMain: "Home",
      breadcrumbSub: "Admin Dashboard",
      stats,
      recentAppointments,
      ...buildFeedbackState(req),
    });
  } catch (err) {
    const user = req.user || null;
    const firstName = getFirstName(user);

    return res.render("admin/admin-dashboard", {
      title: "Admin Dashboard",
      user,
      firstName,
      role: "admin",
      activePage: "admin-dashboard",
      breadcrumbMain: "Home",
      breadcrumbSub: "Admin Dashboard",
      stats: {
        totalUsers: 0,
        totalCategories: 0,
        totalServices: 0,
        totalAppointments: 0,
        pendingAppointments: 0,
        completedAppointments: 0,
      },
      recentAppointments: [],
      message: err.message || "Could not load dashboard data",
      messageType: "error",
    });
  }
}

module.exports = { renderAdminDashboard };
