"use strict";

const StaffServiceService = require("../../services/staffService.service");
const UserService = require("../../services/user.service");
const ServicesService = require("../../services/services.service");
const CategoryService = require("../../services/category.service");
const {
  buildFeedbackState,
  buildRedirectPath,
} = require("../../utils/views/feedback.util");
const {
  getFirstName,
  getLoggedInUser,
} = require("../../utils/views/userView.util");
const { formatPrice } = require("../../utils/views/formatView.util");

const BASE_PATH = "/views/admin-staff-services";

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

async function renderAdminStaffServices(req, res) {
  try {
    const user = await getLoggedInUser(req);
    const firstName = getFirstName(user);

    const [allStaffServices, allUsers, allServices, allCategories] =
      await Promise.all([
        StaffServiceService.getAllStaffServices(),
        UserService.getAllUsers(),
        ServicesService.getServices(),
        CategoryService.getAllCategories(),
      ]);

    // Build lookup maps
    const userMap = {};
    for (const u of allUsers) userMap[u.id] = u;

    const categoryMap = {};
    for (const c of allCategories) categoryMap[c.id] = c.name;

    const serviceMap = {};
    for (const s of allServices) serviceMap[s.id] = s;

    // Enrich staff-service rows
    const staffServices = allStaffServices.map((ss) => {
      const staffUser = userMap[ss.staff_id] || null;
      const svc = serviceMap[ss.service_id] || null;
      const staffName = staffUser
        ? staffUser.fullname || "Staff"
        : `Staff #${ss.staff_id}`;
      const categoryName = svc
        ? categoryMap[svc.category_id] || "Unknown"
        : "Unknown";
      const priceRaw = ss.price_cents || 0;
      return {
        staffId: ss.staff_id,
        serviceId: ss.service_id,
        staffName,
        staffInitials: getInitials(staffName),
        serviceName: svc ? svc.name || "Service" : `Service #${ss.service_id}`,
        categoryName,
        durationMin: ss.duration_min || null,
        priceLabel: priceRaw ? formatPrice(priceRaw) : null,
        priceRaw,
        isActive: ss.is_active !== false,
      };
    });

    // Staff users for the "Select Staff" dropdown
    const staffUsers = allUsers
      .filter((u) => u.role === "staff")
      .map((u) => ({ id: u.id, name: u.fullname }));

    // All services for the "Select Service" dropdown
    const servicesForForm = allServices.map((s) => ({
      id: s.id,
      name: s.name,
      categoryId: s.category_id,
      categoryName: categoryMap[s.category_id] || "Unknown",
    }));

    return res.render("admin/admin-staff-services", {
      title: "Staff Services",
      user,
      firstName,
      role: "admin",
      activePage: "admin-staff-services",
      breadcrumbMain: "Home",
      breadcrumbSub: "Staff Services",
      staffServices,
      staffUsers,
      allServices: servicesForForm,
      ...buildFeedbackState(req),
    });
  } catch (err) {
    const user = req.user || null;
    const firstName = getFirstName(user);
    return res.render("admin/admin-staff-services", {
      title: "Staff Services",
      user,
      firstName,
      role: "admin",
      activePage: "admin-staff-services",
      breadcrumbMain: "Home",
      breadcrumbSub: "Staff Services",
      staffServices: [],
      staffUsers: [],
      allServices: [],
      message: err.message || "Could not load staff services",
      messageType: "error",
    });
  }
}

async function adminAssignStaffService(req, res) {
  const {
    staff_id,
    service_id,
    staff_duration_min,
    staff_price_cents,
    staff_is_active,
  } = req.body;
  try {
    if (!staff_id) {
      return res.redirect(
        buildRedirectPath(BASE_PATH, "Staff member is required.", "error"),
      );
    }
    if (!service_id) {
      return res.redirect(
        buildRedirectPath(BASE_PATH, "Service is required.", "error"),
      );
    }
    await StaffServiceService.assignServiceToStaff(
      Number(staff_id),
      Number(service_id),
      {
        staff_duration_min: staff_duration_min
          ? Number(staff_duration_min)
          : null,
        staff_price_cents: staff_price_cents ? Number(staff_price_cents) : null,
        staff_is_active: staff_is_active !== "false",
      },
    );
    return res.redirect(
      buildRedirectPath(BASE_PATH, "Assignment created successfully."),
    );
  } catch (err) {
    return res.redirect(
      buildRedirectPath(
        BASE_PATH,
        err.message || "Could not create assignment.",
        "error",
      ),
    );
  }
}

async function adminUpdateStaffService(req, res) {
  const staffId = req.params.staffId;
  const serviceId = req.params.serviceId;
  const { staff_duration_min, staff_price_cents, staff_is_active } = req.body;
  try {
    await StaffServiceService.updateStaffService(
      Number(staffId),
      Number(serviceId),
      {
        staff_duration_min: staff_duration_min
          ? Number(staff_duration_min)
          : null,
        staff_price_cents: staff_price_cents ? Number(staff_price_cents) : null,
        staff_is_active:
          staff_is_active !== undefined ? staff_is_active !== "false" : null,
      },
    );
    return res.redirect(
      buildRedirectPath(BASE_PATH, "Assignment updated successfully."),
    );
  } catch (err) {
    return res.redirect(
      buildRedirectPath(
        BASE_PATH,
        err.message || "Could not update assignment.",
        "error",
      ),
    );
  }
}

async function adminDeleteStaffService(req, res) {
  const staffId = req.params.staffId;
  const serviceId = req.params.serviceId;
  try {
    await StaffServiceService.removeServiceFromStaff(
      Number(staffId),
      Number(serviceId),
    );
    return res.redirect(
      buildRedirectPath(BASE_PATH, "Assignment removed successfully."),
    );
  } catch (err) {
    return res.redirect(
      buildRedirectPath(
        BASE_PATH,
        err.message || "Could not remove assignment.",
        "error",
      ),
    );
  }
}

module.exports = {
  renderAdminStaffServices,
  adminAssignStaffService,
  adminUpdateStaffService,
  adminDeleteStaffService,
};
