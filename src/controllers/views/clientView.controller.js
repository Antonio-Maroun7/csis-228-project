"use strict";

const CategoryService = require("../../services/category.service");
const ServicesService = require("../../services/services.service");
const AppointmentService = require("../../services/appointment.service");
const StaffServiceService = require("../../services/staffService.service");
const {
  buildFeedbackState,
  buildRedirectPath,
} = require("../../utils/views/feedback.util");
const {
  getFirstName,
  getLoggedInUser,
} = require("../../utils/views/userView.util");
const {
  decorateCategoriesForView,
} = require("../../utils/views/categoryView.mapper");
const {
  decorateServicesForView,
  getServiceIcon,
} = require("../../utils/views/serviceView.mapper");
const {
  decorateAppointmentsForView,
} = require("../../utils/views/appointmentView.mapper");
const {
  formatPrice,
  generateTimeSlots,
} = require("../../utils/views/formatView.util");
const { getCategoryIcon } = require("../../utils/views/categoryView.mapper");

async function renderClientHome(req, res) {
  try {
    const dbCategories = await CategoryService.getAllCategories();
    const categories = decorateCategoriesForView(dbCategories);

    const user = await getLoggedInUser(req);
    const firstName = getFirstName(user);

    return res.render("client-home", {
      title: "Client Home",
      user,
      firstName,
      role: "client",
      activePage: "client-home",
      breadcrumbMain: "Home",
      breadcrumbSub: "Categories",
      categories,
      stats: {
        availableCategories: categories.length,
        upcomingAppointments: 0,
        favoriteServices: 0,
      },
      message: req.query?.type === "error" ? req.query.message : null,
      messageType: req.query?.type || null,
    });
  } catch (err) {
    const user = req.user || null;
    const firstName = getFirstName(user);

    return res.status(500).render("client-home", {
      title: "Client Home",
      user,
      firstName,
      role: "client",
      activePage: "client-home",
      breadcrumbMain: "Home",
      breadcrumbSub: "Categories",
      categories: [],
      stats: {
        availableCategories: 0,
        upcomingAppointments: 0,
        favoriteServices: 0,
      },
      message: err.message || "Could not load categories",
      messageType: "error",
    });
  }
}

async function renderServicesByCategory(req, res) {
  try {
    const categoryId = req.params.categoryId;

    const dbCategory = await CategoryService.getCategoryById(categoryId);
    const dbServices = await ServicesService.getServicesByCategory(categoryId);

    const services = decorateServicesForView(dbServices);

    const categoryName =
      dbCategory.name || dbCategory.category_name || "Category";

    const user = await getLoggedInUser(req);
    const firstName = getFirstName(user);

    return res.render("services-by-category", {
      title: `${categoryName} Services`,
      user,
      firstName,
      role: "client",
      activePage: "client-home",
      breadcrumbMain: "Home",
      breadcrumbMiddle: "Categories",
      breadcrumbSub: categoryName,
      category: {
        id: dbCategory.id || categoryId,
        name: categoryName,
        description:
          dbCategory.description ||
          "Choose a service to view details and book your appointment.",
        icon: getCategoryIcon(categoryName),
      },
      services,
      stats: {
        availableServices: services.length,
        upcomingAppointments: 0,
        favoriteServices: 0,
      },
      message: req.query?.type === "error" ? req.query.message : null,
      messageType: req.query?.type || null,
    });
  } catch (err) {
    return res.redirect(
      buildRedirectPath(
        "/views/client-home",
        err.message || "Could not load services",
        "error",
      ),
    );
  }
}

async function renderBookAppointment(req, res) {
  try {
    const { serviceId } = req.params;

    const user = await getLoggedInUser(req);
    const firstName = getFirstName(user);

    const dbService = await ServicesService.getServiceById(serviceId);

    if (!dbService) {
      throw new Error("Service not found");
    }

    const categoryId = dbService.category_id || dbService.categoryId;
    let categoryName = "Categories";

    try {
      const dbCategory = await CategoryService.getCategoryById(categoryId);
      categoryName =
        dbCategory.name || dbCategory.category_name || "Categories";
    } catch (err) {
      categoryName = "Categories";
    }

    const dbStaff = await StaffServiceService.getStaffByService(serviceId);

    const serviceName =
      dbService.name || dbService.service_name || "Selected Service";

    const durationMin =
      dbService.default_duration_min ||
      dbService.service_default_duration_min ||
      dbService.duration_min ||
      0;

    const priceValue =
      dbService.base_price_cents ||
      dbService.service_base_price_cents ||
      dbService.default_price_cents ||
      dbService.price_cents ||
      0;

    const service = {
      id: dbService.id || dbService.service_id,
      categoryId,
      name: serviceName,
      description:
        dbService.description ||
        dbService.service_description ||
        "Professional service with trusted care.",
      durationMin: Number(durationMin) || 0,
      priceLabel: formatPrice(priceValue),
      icon: getServiceIcon(serviceName),
    };

    const staffList = (dbStaff || [])
      .filter((staff) => staff && staff.is_active !== false)
      .map((staff) => ({
        id: staff.id || staff.user_id,
        name:
          staff.fullname || staff.user_fullname || staff.name || "Staff Member",
        email: staff.email || staff.user_email || "",
      }));

    const todayISO = new Date().toISOString().split("T")[0];

    return res.render("book-appointment", {
      title: `Book – ${service.name}`,
      user,
      firstName,
      userFullname:
        user?.fullname || user?.user_fullname || user?.name || firstName,
      userEmail: user?.email || user?.user_email || "",
      userPhone: user?.phone || user?.user_phone || "",
      role: "client",
      activePage: "book-appointment",
      breadcrumbMain: "Home",
      breadcrumbMiddle: categoryName,
      breadcrumbSub: "Book Appointment",
      service,
      categoryName,
      staffList,
      timeSlots: generateTimeSlots(),
      todayISO,
      stats: {
        upcomingAppointments: 0,
        favoriteServices: 0,
        nextAppointmentLabel: "Next one after booking",
      },
      message: req.query?.type === "error" ? req.query.message : null,
      messageType: req.query?.type || null,
    });
  } catch (err) {
    return res.redirect(
      buildRedirectPath(
        "/views/client-home",
        err.message || "Could not load booking page",
        "error",
      ),
    );
  }
}

async function bookAppointment(req, res) {
  const { service_id } = req.body;

  try {
    const user = req.user || {};
    const clientId = user.id || user.user_id;

    const { staff_id, appointment_date, appointment_time, appointment_notes } =
      req.body;

    if (!clientId) {
      throw new Error("Please login again before booking.");
    }

    if (!service_id || !staff_id || !appointment_date || !appointment_time) {
      throw new Error(
        "Please select a staff member, date, and time before confirming.",
      );
    }

    const starts_at = new Date(`${appointment_date}T${appointment_time}:00`);

    if (Number.isNaN(starts_at.getTime())) {
      throw new Error("Invalid appointment date or time.");
    }

    await AppointmentService.createAppointment({
      client_id: Number(clientId),
      staff_id: Number(staff_id),
      starts_at,
      service_items: [Number(service_id)],
      appointment_notes: appointment_notes || null,
    });

    return res.redirect(
      buildRedirectPath(
        "/views/client-home",
        "Your appointment has been booked successfully!",
        "success",
      ),
    );
  } catch (err) {
    return res.redirect(
      buildRedirectPath(
        `/views/book-appointment/${service_id || ""}`,
        err.message || "Booking failed. Please try again.",
        "error",
      ),
    );
  }
}

async function renderMyAppointments(req, res) {
  try {
    const user = await getLoggedInUser(req);
    const firstName = getFirstName(user);
    const clientId = user?.id || user?.user_id;

    const rows = await AppointmentService.getClientAppointmentsRich(clientId);
    const appointments = decorateAppointmentsForView(rows);

    const now = new Date();
    const stats = {
      total: appointments.length,
      upcoming: appointments.filter(
        (a) =>
          ["pending", "confirmed"].includes(a.status) &&
          a.rawStartAt &&
          a.rawStartAt >= now,
      ).length,
      completed: appointments.filter((a) => a.status === "completed").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
    };

    return res.render("my-appointments", {
      title: "My Appointments",
      user,
      firstName,
      role: "client",
      activePage: "my-appointments",
      breadcrumbMain: "Home",
      breadcrumbSub: "My Appointments",
      appointments,
      stats,
      ...buildFeedbackState(req),
    });
  } catch (err) {
    const user = req.user || null;
    const firstName = getFirstName(user);

    return res.render("my-appointments", {
      title: "My Appointments",
      user,
      firstName,
      role: "client",
      activePage: "my-appointments",
      breadcrumbMain: "Home",
      breadcrumbSub: "My Appointments",
      appointments: [],
      stats: { total: 0, upcoming: 0, completed: 0, cancelled: 0 },
      message: err.message || "Could not load appointments",
      messageType: "error",
    });
  }
}

async function cancelMyAppointment(req, res) {
  const appointmentId = req.params.id;

  try {
    await AppointmentService.cancelAppointment(appointmentId);

    return res.redirect(
      buildRedirectPath(
        "/views/my-appointments",
        "Appointment cancelled successfully.",
      ),
    );
  } catch (err) {
    return res.redirect(
      buildRedirectPath(
        "/views/my-appointments",
        err.message || "Could not cancel appointment.",
        "error",
      ),
    );
  }
}

module.exports = {
  renderClientHome,
  renderServicesByCategory,
  renderBookAppointment,
  bookAppointment,
  renderMyAppointments,
  cancelMyAppointment,
};
