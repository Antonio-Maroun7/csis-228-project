"use strict";

const AppointmentService = require("../../services/appointment.service");
const ServicesService = require("../../services/services.service");
const UserService = require("../../services/user.service");
const {
  buildFeedbackState,
  buildRedirectPath,
} = require("../../utils/views/feedback.util");
const {
  getFirstName,
  getLoggedInUser,
} = require("../../utils/views/userView.util");
const {
  decorateAdminAppointmentsForView,
} = require("../../utils/views/appointmentView.mapper");

async function renderAdminAppointments(req, res) {
  try {
    const user = await getLoggedInUser(req);
    const firstName = getFirstName(user);

    const [rawAppointments, allServicesRaw, allUsersRaw] = await Promise.all([
      AppointmentService.getAllAppointments(),
      ServicesService.getServices(),
      UserService.getAllUsers(),
    ]);

    const appointments = decorateAdminAppointmentsForView(rawAppointments);
    const allServices = allServicesRaw.map((s) => ({ id: s.id, name: s.name }));
    const staffUsers = allUsersRaw
      .filter((u) => u.role === "staff")
      .map((u) => ({ id: u.id, fullname: u.fullname }));

    const summary = {
      total: appointments.length,
      confirmed: appointments.filter((a) => a.status === "confirmed").length,
      pending: appointments.filter((a) => a.status === "pending").length,
      completed: appointments.filter((a) => a.status === "completed").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
    };

    return res.render("admin-appointments", {
      title: "All Appointments",
      user,
      firstName,
      role: "admin",
      activePage: "admin-appointments",
      breadcrumbMain: "Home",
      breadcrumbSub: "All Appointments",
      appointments,
      allServices,
      staffUsers,
      summary,
      ...buildFeedbackState(req),
    });
  } catch (err) {
    const user = req.user || null;
    const firstName = getFirstName(user);

    return res.render("admin-appointments", {
      title: "All Appointments",
      user,
      firstName,
      role: "admin",
      activePage: "admin-appointments",
      breadcrumbMain: "Home",
      breadcrumbSub: "All Appointments",
      appointments: [],
      allServices: [],
      staffUsers: [],
      summary: {
        total: 0,
        confirmed: 0,
        pending: 0,
        completed: 0,
        cancelled: 0,
      },
      message: err.message || "Could not load appointments",
      messageType: "error",
    });
  }
}

async function adminUpdateAppointmentStatus(req, res) {
  const appointmentId = req.params.id;
  const { status } = req.body;

  const ALLOWED = ["pending", "confirmed", "completed", "cancelled", "no_show"];

  if (!status || !ALLOWED.includes(status)) {
    return res.redirect(
      buildRedirectPath(
        "/views/admin-appointments",
        "Invalid appointment status.",
        "error",
      ),
    );
  }

  try {
    await AppointmentService.updateAppointmentStatus(appointmentId, status);

    const label =
      status === "confirmed"
        ? "confirmed"
        : status === "completed"
          ? "marked as completed"
          : status === "cancelled"
            ? "cancelled"
            : status;

    return res.redirect(
      buildRedirectPath(
        "/views/admin-appointments",
        `Appointment ${label} successfully.`,
      ),
    );
  } catch (err) {
    return res.redirect(
      buildRedirectPath(
        "/views/admin-appointments",
        err.message || "Could not update appointment status.",
        "error",
      ),
    );
  }
}

module.exports = { renderAdminAppointments, adminUpdateAppointmentStatus };
