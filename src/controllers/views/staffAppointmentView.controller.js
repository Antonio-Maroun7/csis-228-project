"use strict";

const AppointmentService = require("../../services/appointment.service");

const {
  buildFeedbackState,
  buildRedirectPath,
} = require("../../utils/views/feedback.util");

const {
  getLoggedInUser,
  getFirstName,
} = require("../../utils/views/userView.util");

const STATUS_LIST = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
];

const ITEMS_PER_PAGE = 8;

function toValidDate(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function formatDate(dateValue) {
  const date = toValidDate(dateValue);

  if (!date) return "—";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatDateInput(dateValue) {
  const date = toValidDate(dateValue);

  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTime(dateValue) {
  const date = toValidDate(dateValue);

  if (!date) return "—";

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitials(name) {
  if (!name) return "?";

  const parts = String(name).trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

function normalizeStatus(status) {
  return STATUS_LIST.includes(status) ? status : "pending";
}

function getStatusLabel(status) {
  return normalizeStatus(status)
    .replace("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getAppointmentCode(id) {
  return `APT-${String(id).padStart(4, "0")}`;
}

function decorateStaffAppointment(row) {
  const startDate = toValidDate(row.appointment_start_at);
  const endDate = toValidDate(row.appointment_ends_at);

  const durationFromDate =
    startDate && endDate
      ? Math.max(
          0,
          Math.round((endDate.getTime() - startDate.getTime()) / 60000),
        )
      : 0;

  const durationMin = Number(row.duration_min || durationFromDate || 0);

  const status = normalizeStatus(row.appointment_status);

  const clientName = row.client_name || "Unknown Client";
  const clientEmail = row.client_email || "";

  return {
    id: row.appointment_id,
    code: getAppointmentCode(row.appointment_id),

    clientName,
    clientEmail,
    clientInitials: getInitials(clientName),

    serviceName: row.service_name || "Service",
    categoryName: row.category_name || "General",

    dateLabel: formatDate(row.appointment_start_at),
    timeLabel: formatTime(row.appointment_start_at),
    rawDate: formatDateInput(row.appointment_start_at),
    rawStartAt: row.appointment_start_at,

    durationMin,
    status,
    statusLabel: getStatusLabel(status),

    notes: row.appointment_notes || "—",

    canConfirm: status === "pending",
    canComplete: status === "confirmed",
    isLocked: ["completed", "cancelled", "no_show"].includes(status),
  };
}

function isSameDate(dateValue, dateInputValue) {
  if (!dateInputValue) return true;

  return formatDateInput(dateValue) === dateInputValue;
}

function buildStats(appointments) {
  const todayInput = formatDateInput(new Date());

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayInput = formatDateInput(yesterday);

  const todayAppointments = appointments.filter(
    (appointment) => appointment.rawDate === todayInput,
  );

  const yesterdayTotal = appointments.filter(
    (appointment) => appointment.rawDate === yesterdayInput,
  ).length;

  const source =
    todayAppointments.length > 0 ? todayAppointments : appointments;

  const pending = source.filter((item) => item.status === "pending").length;
  const confirmed = source.filter((item) => item.status === "confirmed").length;
  const completed = source.filter((item) => item.status === "completed").length;
  const cancelled = source.filter((item) => item.status === "cancelled").length;

  const total = source.length;

  return {
    today: todayAppointments.length,
    yesterdayTotal,
    pending,
    confirmed,
    completed,
    cancelled,
    total,
  };
}

function buildDonutStyle(stats) {
  const total = Math.max(1, stats.total || 0);

  const confirmedDeg = (stats.confirmed / total) * 360;
  const pendingDeg = confirmedDeg + (stats.pending / total) * 360;
  const completedDeg = pendingDeg + (stats.completed / total) * 360;

  return `
    background: conic-gradient(
      #22c55e 0deg ${confirmedDeg}deg,
      #f59e0b ${confirmedDeg}deg ${pendingDeg}deg,
      #8b5cf6 ${pendingDeg}deg ${completedDeg}deg,
      #ef4444 ${completedDeg}deg 360deg
    );
  `;
}

function buildPageUrl(page, query) {
  const params = new URLSearchParams();

  if (query.search) params.set("search", query.search);
  if (query.status) params.set("status", query.status);
  if (query.date) params.set("date", query.date);

  params.set("page", String(page));

  return `/views/staff-appointments?${params.toString()}`;
}

function paginate(items, page) {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  return {
    items: items.slice(startIndex, endIndex),
    totalItems,
    totalPages,
    currentPage,
    startEntry: totalItems === 0 ? 0 : startIndex + 1,
    endEntry: Math.min(endIndex, totalItems),
  };
}

async function renderStaffAppointments(req, res) {
  try {
    const user = await getLoggedInUser(req);
    const staffId = user?.user_id || user?.id;
    const firstName = getFirstName(user);

    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "").trim();
    const selectedDate = String(req.query.date || "").trim();
    const page = Number(req.query.page || 1);

    const rawAppointments =
      await AppointmentService.getStaffAppointmentsRich(staffId);

    let appointments = rawAppointments.map(decorateStaffAppointment);

    const allDecoratedAppointments = appointments.slice();

    if (search) {
      const searchLower = search.toLowerCase();

      appointments = appointments.filter((appointment) => {
        return (
          appointment.clientName.toLowerCase().includes(searchLower) ||
          appointment.clientEmail.toLowerCase().includes(searchLower) ||
          appointment.serviceName.toLowerCase().includes(searchLower) ||
          appointment.categoryName.toLowerCase().includes(searchLower) ||
          appointment.code.toLowerCase().includes(searchLower)
        );
      });
    }

    if (status && STATUS_LIST.includes(status)) {
      appointments = appointments.filter(
        (appointment) => appointment.status === status,
      );
    }

    if (selectedDate) {
      appointments = appointments.filter((appointment) =>
        isSameDate(appointment.rawStartAt, selectedDate),
      );
    }

    const stats = buildStats(allDecoratedAppointments);

    const todayInput = formatDateInput(new Date());

    let todaySchedule = allDecoratedAppointments
      .filter((appointment) => appointment.rawDate === todayInput)
      .sort((a, b) => new Date(a.rawStartAt) - new Date(b.rawStartAt));

    if (todaySchedule.length === 0) {
      todaySchedule = allDecoratedAppointments
        .filter((appointment) => {
          return (
            new Date(appointment.rawStartAt) >= new Date() &&
            appointment.status !== "cancelled"
          );
        })
        .sort((a, b) => new Date(a.rawStartAt) - new Date(b.rawStartAt))
        .slice(0, 7);
    } else {
      todaySchedule = todaySchedule.slice(0, 7);
    }

    const paginated = paginate(appointments, page);

    return res.render("staff/staff-appointments", {
      title: "Staff Appointments",
      role: "staff",
      activePage: "staff-appointments",
      user,
      firstName,

      appointments: paginated.items,
      allAppointments: appointments,
      todaySchedule,

      stats,
      donutStyle: buildDonutStyle(stats),

      search,
      status,
      selectedDate,

      currentPage: paginated.currentPage,
      totalPages: paginated.totalPages,
      totalItems: paginated.totalItems,
      startEntry: paginated.startEntry,
      endEntry: paginated.endEntry,
      previousPageUrl: buildPageUrl(paginated.currentPage - 1, req.query),
      nextPageUrl: buildPageUrl(paginated.currentPage + 1, req.query),
      buildPageUrl: (targetPage) => buildPageUrl(targetPage, req.query),

      ...buildFeedbackState(req),
    });
  } catch (err) {
    console.error(
      "[staffAppointmentView] renderStaffAppointments error:",
      err.message,
    );

    return res.status(500).render("staff/staff-appointments", {
      title: "Staff Appointments",
      role: "staff",
      activePage: "staff-appointments",
      user: req.user || null,
      firstName: "Staff",

      appointments: [],
      allAppointments: [],
      todaySchedule: [],

      stats: {
        today: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        total: 0,
      },
      donutStyle: "",

      search: "",
      status: "",
      selectedDate: "",

      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      startEntry: 0,
      endEntry: 0,
      previousPageUrl: "#",
      nextPageUrl: "#",
      buildPageUrl: () => "#",

      message: "Could not load staff appointments.",
      messageType: "error",
    });
  }
}

async function updateStaffAppointmentStatus(req, res) {
  const appointmentId = req.params.id;
  const requestedStatus = String(req.body.status || "").trim();

  if (!STATUS_LIST.includes(requestedStatus)) {
    return res.redirect(
      buildRedirectPath(
        "/views/staff-appointments",
        "Invalid appointment status.",
        "error",
      ),
    );
  }

  try {
    const user = await getLoggedInUser(req);
    const staffId = user?.user_id || user?.id;

    const staffAppointments =
      await AppointmentService.getStaffAppointmentsRich(staffId);

    const appointment = staffAppointments.find(
      (item) => Number(item.appointment_id) === Number(appointmentId),
    );

    if (!appointment) {
      return res.redirect(
        buildRedirectPath(
          "/views/staff-appointments",
          "You can only update appointments assigned to you.",
          "error",
        ),
      );
    }

    const currentStatus = normalizeStatus(appointment.appointment_status);

    const allowedTransition =
      (currentStatus === "pending" &&
        ["confirmed", "cancelled"].includes(requestedStatus)) ||
      (currentStatus === "confirmed" &&
        ["completed", "cancelled", "no_show"].includes(requestedStatus));

    if (!allowedTransition) {
      return res.redirect(
        buildRedirectPath(
          "/views/staff-appointments",
          "This appointment cannot be updated from its current status.",
          "error",
        ),
      );
    }

    await AppointmentService.updateAppointmentStatus(
      appointmentId,
      requestedStatus,
    );

    return res.redirect(
      buildRedirectPath(
        "/views/staff-appointments",
        `Appointment ${getStatusLabel(requestedStatus).toLowerCase()} successfully.`,
        "success",
      ),
    );
  } catch (err) {
    console.error("[staffAppointmentView] update status error:", err.message);

    return res.redirect(
      buildRedirectPath(
        "/views/staff-appointments",
        err.message || "Could not update appointment status.",
        "error",
      ),
    );
  }
}

module.exports = {
  renderStaffAppointments,
  updateStaffAppointmentStatus,
};
