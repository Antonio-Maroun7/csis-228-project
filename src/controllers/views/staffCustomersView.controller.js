"use strict";

const AppointmentRepository = require("../../repositories/appointment.repository");
const { buildFeedbackState } = require("../../utils/views/feedback.util");
const {
  getLoggedInUser,
  getFirstName,
} = require("../../utils/views/userView.util");

const ITEMS_PER_PAGE = 8;

const AVATAR_COLORS = [
  "#0f8f8c",
  "#f97316",
  "#16a34a",
  "#7c3aed",
  "#ef4444",
  "#0ea5e9",
  "#f59e0b",
  "#ec4899",
];

function getCustomerCode(id) {
  return `CUST-${String(id).padStart(4, "0")}`;
}

function getAvatarColor(id) {
  return AVATAR_COLORS[(Number(id) - 1) % AVATAR_COLORS.length];
}

function getInitials(name) {
  const parts = (name || "").trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function formatDate(dateVal) {
  if (!dateVal) return "—";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Derives a customer status from their appointment history with this staff.
 * Priority: vip > active > follow_up > inactive
 */
function computeCustomerStatus(row) {
  const completedCount = Number(row.completed_count || 0);
  const pendingCount = Number(row.pending_count || 0);
  const lastAppointmentAt = row.last_appointment_at
    ? new Date(row.last_appointment_at)
    : null;

  const now = new Date();
  const daysSinceLast = lastAppointmentAt
    ? Math.floor((now - lastAppointmentAt) / (1000 * 60 * 60 * 24))
    : 9999;

  if (completedCount >= 3) return "vip";
  if (pendingCount > 0 || (completedCount > 0 && daysSinceLast <= 60))
    return "active";
  if (completedCount > 0 && daysSinceLast <= 180) return "follow_up";
  return "inactive";
}

function getStatusLabel(status) {
  const labels = {
    vip: "VIP",
    active: "Active",
    follow_up: "Follow-up",
    inactive: "Inactive",
  };
  return labels[status] || "Unknown";
}

function isNewThisMonth(firstAppointmentAt) {
  if (!firstAppointmentAt) return false;
  const d = new Date(firstAppointmentAt);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  );
}

function decorateCustomer(row) {
  const status = computeCustomerStatus(row);
  return {
    clientId: row.client_id,
    customerCode: getCustomerCode(row.client_id),
    name: row.client_name || "Unknown",
    email: row.client_email || "—",
    phone: row.client_phone || "—",
    isActive: row.client_is_active,
    initials: getInitials(row.client_name || ""),
    avatarColor: getAvatarColor(row.client_id),
    preferredService: row.preferred_service_name || "—",
    lastAppointmentAt: row.last_appointment_at,
    lastAppointmentLabel: formatDate(row.last_appointment_at),
    lastAppointmentStatus: row.last_appointment_status || "",
    notes: row.last_appointment_notes || "—",
    appointmentCount: Number(row.appointment_count || 0),
    completedCount: Number(row.completed_count || 0),
    status,
    statusLabel: getStatusLabel(status),
    isNewThisMonth: isNewThisMonth(row.first_appointment_at),
  };
}

function computeStats(customers) {
  return {
    total: customers.length,
    active: customers.filter((c) => c.status === "active").length,
    vip: customers.filter((c) => c.status === "vip").length,
    newThisMonth: customers.filter((c) => c.isNewThisMonth).length,
  };
}

function computeSummary(customers) {
  const total = customers.length;
  const denom = Math.max(1, total);
  const active = customers.filter((c) => c.status === "active").length;
  const followUp = customers.filter((c) => c.status === "follow_up").length;
  const vip = customers.filter((c) => c.status === "vip").length;
  const inactive = customers.filter((c) => c.status === "inactive").length;

  const activeDeg = (active / denom) * 360;
  const followUpDeg = activeDeg + (followUp / denom) * 360;
  const vipDeg = followUpDeg + (vip / denom) * 360;

  const donutStyle =
    total === 0
      ? "background: #e2e8f0;"
      : `background: conic-gradient(
        #16a34a 0deg ${activeDeg}deg,
        #f97316 ${activeDeg}deg ${followUpDeg}deg,
        #7c3aed ${followUpDeg}deg ${vipDeg}deg,
        #ef4444 ${vipDeg}deg 360deg
      );`;

  return { active, followUp, vip, inactive, total, donutStyle };
}

function buildPageUrl(req, page) {
  const q = new URLSearchParams(req.query);
  q.set("page", String(page));
  return `/views/staff-customers?${q.toString()}`;
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

async function renderStaffCustomers(req, res) {
  try {
    const user = await getLoggedInUser(req);
    const firstName = getFirstName(user);
    const staffId = user?.user_id || user?.id || req.user?.id;

    const search = (req.query.search || "").trim().toLowerCase();
    const serviceFilter = req.query.service || "";
    const statusFilter = req.query.status || "";
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);

    const rows = await AppointmentRepository.findStaffCustomersRich(staffId);
    const allCustomers = rows.map(decorateCustomer);

    // Unique preferred services for the dropdown filter
    const serviceSet = new Set();
    allCustomers.forEach((c) => {
      if (c.preferredService && c.preferredService !== "—") {
        serviceSet.add(c.preferredService);
      }
    });
    const serviceOptions = Array.from(serviceSet).sort();

    const stats = computeStats(allCustomers);
    const summary = computeSummary(allCustomers);

    // Follow-up reminder list (customers needing a follow-up)
    const followUpCustomers = allCustomers
      .filter((c) => c.status === "follow_up")
      .slice(0, 6);

    // Apply search and filters
    let filtered = allCustomers;

    if (search) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search) ||
          c.phone.toLowerCase().includes(search) ||
          c.preferredService.toLowerCase().includes(search) ||
          c.customerCode.toLowerCase().includes(search),
      );
    }

    if (serviceFilter) {
      filtered = filtered.filter((c) => c.preferredService === serviceFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    const paginated = paginate(filtered, page);

    return res.render("staff/staff-customers", {
      title: "Staff Customers",
      role: "staff",
      activePage: "staff-customers",
      user,
      firstName,

      customers: paginated.items,
      totalItems: paginated.totalItems,
      totalPages: paginated.totalPages,
      currentPage: paginated.currentPage,
      startEntry: paginated.startEntry,
      endEntry: paginated.endEntry,
      previousPageUrl: buildPageUrl(req, paginated.currentPage - 1),
      nextPageUrl: buildPageUrl(req, paginated.currentPage + 1),
      buildPageUrl: (targetPage) => buildPageUrl(req, targetPage),

      stats,
      summary,
      followUpCustomers,

      search: req.query.search || "",
      serviceFilter,
      statusFilter,
      serviceOptions,

      ...buildFeedbackState(req),
    });
  } catch (err) {
    console.error(
      "[staffCustomersView] renderStaffCustomers error:",
      err.message,
    );

    return res.status(500).render("staff/staff-customers", {
      title: "Staff Customers",
      role: "staff",
      activePage: "staff-customers",
      user: req.user || null,
      firstName: "Staff",

      customers: [],
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      startEntry: 0,
      endEntry: 0,
      previousPageUrl: "#",
      nextPageUrl: "#",
      buildPageUrl: () => "#",

      stats: { total: 0, active: 0, vip: 0, newThisMonth: 0 },
      summary: {
        active: 0,
        followUp: 0,
        vip: 0,
        inactive: 0,
        total: 0,
        donutStyle: "",
      },
      followUpCustomers: [],

      search: "",
      serviceFilter: "",
      statusFilter: "",
      serviceOptions: [],

      message: null,
      messageType: null,
    });
  }
}

module.exports = { renderStaffCustomers };
