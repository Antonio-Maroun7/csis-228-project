"use strict";

const ServicesService = require("../../services/services.service");
const { buildFeedbackState } = require("../../utils/views/feedback.util");
const {
  getFirstName,
  getLoggedInUser,
} = require("../../utils/views/userView.util");
const { formatPrice } = require("../../utils/views/formatView.util");
const { getServiceIcon } = require("../../utils/views/serviceView.mapper");

async function renderAdminServices(req, res) {
  try {
    const user = await getLoggedInUser(req);
    const firstName = getFirstName(user);

    const dbServices = await ServicesService.getServices();

    const services = dbServices.map((s) => ({
      id: s.id || s.service_id,
      name: s.name || s.service_name || "Service",
      description: s.description || s.service_description || "",
      categoryId: s.category_id || s.categoryId,
      durationMin: Number(
        s.default_duration_min ||
          s.service_default_duration_min ||
          s.duration_min ||
          0,
      ),
      priceLabel: formatPrice(
        s.base_price_cents ||
          s.service_base_price_cents ||
          s.default_price_cents ||
          s.price_cents ||
          0,
      ),
      isActive: s.is_active !== false,
      icon: getServiceIcon(s.name || s.service_name || ""),
    }));

    return res.render("admin-services", {
      title: "Services",
      user,
      firstName,
      role: "admin",
      activePage: "admin-services",
      breadcrumbMain: "Home",
      breadcrumbSub: "Services",
      services,
      ...buildFeedbackState(req),
    });
  } catch (err) {
    const user = req.user || null;
    const firstName = getFirstName(user);

    return res.render("admin-services", {
      title: "Services",
      user,
      firstName,
      role: "admin",
      activePage: "admin-services",
      breadcrumbMain: "Home",
      breadcrumbSub: "Services",
      services: [],
      message: err.message || "Could not load services",
      messageType: "error",
    });
  }
}

module.exports = { renderAdminServices };
