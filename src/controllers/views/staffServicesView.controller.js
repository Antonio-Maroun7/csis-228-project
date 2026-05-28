"use strict";

const StaffServiceService = require("../../services/staffService.service");
const ServicesService = require("../../services/services.service");
const CategoryService = require("../../services/category.service");
const { buildFeedbackState } = require("../../utils/views/feedback.util");
const {
  getLoggedInUser,
  getFirstName,
} = require("../../utils/views/userView.util");
const { formatPrice } = require("../../utils/views/formatView.util");

const ITEMS_PER_PAGE = 8;

const ICON_COLORS = [
  "#0f8f8c",
  "#f97316",
  "#16a34a",
  "#7c3aed",
  "#ef4444",
  "#0ea5e9",
  "#f59e0b",
  "#ec4899",
];

function getServiceCode(id) {
  return `SERV-${String(id).padStart(4, "0")}`;
}

function getIconColor(serviceId) {
  return ICON_COLORS[(Number(serviceId) - 1) % ICON_COLORS.length];
}

/**
 * Derives display status from staff and global service flags.
 * - active   : staff enabled + service globally active
 * - limited  : staff enabled + service globally inactive
 * - inactive : staff disabled
 */
function getServiceStatus(staffIsActive, serviceIsActive) {
  if (!staffIsActive) return "inactive";
  if (!serviceIsActive) return "limited";
  return "active";
}

function getServiceStatusLabel(status) {
  const labels = { active: "Active", limited: "Limited", inactive: "Inactive" };
  return labels[status] || "Unknown";
}

function buildEnrichedService(ss, serviceMap, categoryMap) {
  const svc = serviceMap[ss.service_id] || null;
  const status = getServiceStatus(ss.is_active, svc ? svc.is_active : false);
  const categoryId = svc ? svc.category_id : null;
  const categoryName = categoryId
    ? categoryMap[categoryId] || "Unknown"
    : "Unknown";
  const durationMin =
    ss.duration_min != null
      ? ss.duration_min
      : svc
        ? svc.default_duration_min
        : null;
  const priceCents =
    ss.price_cents != null ? ss.price_cents : svc ? svc.base_price_cents : null;

  return {
    staffId: ss.staff_id,
    serviceId: ss.service_id,
    serviceCode: getServiceCode(ss.service_id),
    serviceName: svc ? svc.name : `Service #${ss.service_id}`,
    categoryId,
    categoryName,
    durationMin,
    priceCents,
    priceLabel: priceCents ? formatPrice(priceCents) : "—",
    durationLabel: durationMin ? `${durationMin} min` : "—",
    description: svc ? svc.description || "" : "",
    status,
    statusLabel: getServiceStatusLabel(status),
    iconColor: getIconColor(ss.service_id),
    iconLetter: svc ? svc.name.charAt(0).toUpperCase() : "S",
  };
}

function buildPageUrl(req, page) {
  const q = new URLSearchParams(req.query);
  q.set("page", page);
  return `/views/staff-services?${q.toString()}`;
}

async function renderStaffServices(req, res) {
  try {
    const user = await getLoggedInUser(req);
    const firstName = getFirstName(user);
    const staffId = req.user?.id || user?.id;

    const search = (req.query.search || "").trim().toLowerCase();
    const categoryFilter = req.query.category || "";
    const statusFilter = req.query.status || "";
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);

    const [staffServices, allServices, allCategories] = await Promise.all([
      StaffServiceService.getStaffServices(staffId),
      ServicesService.getServices(),
      CategoryService.getAllCategories(),
    ]);

    // Build lookup maps
    const serviceMap = {};
    for (const s of allServices) serviceMap[s.id] = s;

    const categoryMap = {};
    for (const c of allCategories) categoryMap[c.id] = c.name;

    // Enrich all staff services
    const allEnriched = staffServices.map((ss) =>
      buildEnrichedService(ss, serviceMap, categoryMap),
    );

    // Stats (always computed from full list, not filtered)
    const statsActive = allEnriched.filter((s) => s.status === "active").length;
    const statsLimited = allEnriched.filter(
      (s) => s.status === "limited",
    ).length;
    const statsInactive = allEnriched.filter(
      (s) => s.status === "inactive",
    ).length;
    const totalServices = allEnriched.length;

    const uniqueCategories = new Set(
      allEnriched.map((s) => s.categoryId).filter(Boolean),
    );

    // Donut chart gradient for summary card
    const totalForDonut = totalServices || 1;
    const activePercent = Math.round((statsActive / totalForDonut) * 100);
    const limitedPercent = Math.round((statsLimited / totalForDonut) * 100);
    const inactivePercent = 100 - activePercent - limitedPercent;
    const donutGradient = `conic-gradient(
      #16a34a 0% ${activePercent}%,
      #f97316 ${activePercent}% ${activePercent + limitedPercent}%,
      #94a3b8 ${activePercent + limitedPercent}% 100%
    )`;

    // Apply filters for the table
    let filtered = allEnriched;
    if (search) {
      filtered = filtered.filter(
        (s) =>
          s.serviceName.toLowerCase().includes(search) ||
          s.categoryName.toLowerCase().includes(search) ||
          s.serviceCode.toLowerCase().includes(search),
      );
    }
    if (categoryFilter) {
      filtered = filtered.filter(
        (s) => String(s.categoryId) === String(categoryFilter),
      );
    }
    if (statusFilter) {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    // Pagination
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
    const currentPage = Math.min(page, totalPages);
    const startEntry =
      totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endEntry = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);
    const services = filtered.slice(startEntry - 1, endEntry);

    // Categories for filter dropdown
    const categoryOptions = allCategories.map((c) => ({
      id: c.id,
      name: c.name,
    }));

    return res.render("staff/staff-services", {
      title: "My Services",
      role: "staff",
      activePage: "staff-services",
      user,
      firstName,
      services,
      stats: {
        total: totalServices,
        active: statsActive,
        categories: uniqueCategories.size,
        inactive: statsInactive + statsLimited,
      },
      summary: {
        active: statsActive,
        limited: statsLimited,
        inactive: statsInactive,
        total: totalServices,
        donutGradient,
        inactivePercent,
      },
      categoryOptions,
      search: req.query.search || "",
      categoryFilter,
      statusFilter,
      currentPage,
      totalPages,
      totalItems,
      startEntry,
      endEntry,
      buildPageUrl: (p) => buildPageUrl(req, p),
      previousPageUrl: buildPageUrl(req, currentPage - 1),
      nextPageUrl: buildPageUrl(req, currentPage + 1),
      ...buildFeedbackState(req),
    });
  } catch (err) {
    const user = req.user || null;
    const firstName = getFirstName(user);
    return res.render("staff/staff-services", {
      title: "My Services",
      role: "staff",
      activePage: "staff-services",
      user,
      firstName,
      services: [],
      stats: { total: 0, active: 0, categories: 0, inactive: 0 },
      summary: {
        active: 0,
        limited: 0,
        inactive: 0,
        total: 0,
        donutGradient: "conic-gradient(#94a3b8 0% 100%)",
        inactivePercent: 100,
      },
      categoryOptions: [],
      search: "",
      categoryFilter: "",
      statusFilter: "",
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      startEntry: 0,
      endEntry: 0,
      buildPageUrl: (p) => `/views/staff-services?page=${p}`,
      previousPageUrl: "/views/staff-services?page=1",
      nextPageUrl: "/views/staff-services?page=1",
      message: err.message || "Could not load services",
      messageType: "error",
    });
  }
}

module.exports = { renderStaffServices };
