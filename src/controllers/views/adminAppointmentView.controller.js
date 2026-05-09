"use strict";

const AppointmentService = require("../../services/appointment.service");
const { buildFeedbackState } = require("../../utils/views/feedback.util");
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

    const allAppointments = await AppointmentService.getAllAppointments();
    const appointments = decorateAdminAppointmentsForView(allAppointments);

    return res.render("admin-appointments", {
      title: "All Appointments",
      user,
      firstName,
      role: "admin",
      activePage: "admin-appointments",
      breadcrumbMain: "Home",
      breadcrumbSub: "All Appointments",
      appointments,
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
      message: err.message || "Could not load appointments",
      messageType: "error",
    });
  }
}

module.exports = { renderAdminAppointments };
