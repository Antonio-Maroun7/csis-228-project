"use strict";

const StaffServiceService = require("../../services/staffService.service");
const UserService = require("../../services/user.service");
const ServicesService = require("../../services/services.service");
const { buildFeedbackState } = require("../../utils/views/feedback.util");
const {
  getFirstName,
  getLoggedInUser,
} = require("../../utils/views/userView.util");
const { formatPrice } = require("../../utils/views/formatView.util");

async function renderAdminStaffServices(req, res) {
  try {
    const user = await getLoggedInUser(req);
    const firstName = getFirstName(user);

    const [allStaffServices, allUsers, allServices] = await Promise.all([
      StaffServiceService.getAllStaffServices(),
      UserService.getAllUsers(),
      ServicesService.getServices(),
    ]);

    const userMap = {};
    for (const u of allUsers) {
      userMap[u.id] = u;
    }

    const serviceMap = {};
    for (const s of allServices) {
      serviceMap[s.id || s.service_id] = s;
    }

    const staffServices = allStaffServices.map((ss) => {
      const staffUser = userMap[ss.staff_id] || null;
      const svc = serviceMap[ss.service_id] || null;
      return {
        staffId: ss.staff_id,
        serviceId: ss.service_id,
        staffName: staffUser
          ? staffUser.fullname || staffUser.user_fullname || "Staff"
          : `Staff #${ss.staff_id}`,
        serviceName: svc
          ? svc.name || svc.service_name || "Service"
          : `Service #${ss.service_id}`,
        durationMin: ss.duration_min || null,
        priceLabel: ss.price_cents ? formatPrice(ss.price_cents) : null,
      };
    });

    return res.render("admin-staff-services", {
      title: "Staff Services",
      user,
      firstName,
      role: "admin",
      activePage: "admin-staff-services",
      breadcrumbMain: "Home",
      breadcrumbSub: "Staff Services",
      staffServices,
      ...buildFeedbackState(req),
    });
  } catch (err) {
    const user = req.user || null;
    const firstName = getFirstName(user);

    return res.render("admin-staff-services", {
      title: "Staff Services",
      user,
      firstName,
      role: "admin",
      activePage: "admin-staff-services",
      breadcrumbMain: "Home",
      breadcrumbSub: "Staff Services",
      staffServices: [],
      message: err.message || "Could not load staff services",
      messageType: "error",
    });
  }
}

module.exports = { renderAdminStaffServices };
