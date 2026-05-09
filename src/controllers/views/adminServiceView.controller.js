"use strict";

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
const { getServiceIcon } = require("../../utils/views/serviceView.mapper");

async function renderAdminServices(req, res) {
  try {
    const user = await getLoggedInUser(req);
    const firstName = getFirstName(user);

    const [dbServices, dbCategories] = await Promise.all([
      ServicesService.getServices(),
      CategoryService.getAllCategories(),
    ]);

    const categoryMap = {};
    (dbCategories || []).forEach((c) => {
      categoryMap[c.id] = c.name;
    });

    const services = dbServices.map((s) => ({
      id: s.id,
      name: s.name || "Service",
      description: s.description || "",
      categoryId: s.category_id,
      categoryName: categoryMap[s.category_id] || "Unknown",
      durationMin: Number(s.default_duration_min || 0),
      priceLabel: formatPrice(s.base_price_cents || 0),
      priceRaw: s.base_price_cents || 0,
      isActive: s.is_active !== false,
      icon: getServiceIcon(s.name || ""),
    }));

    const categories = (dbCategories || []).map((c) => ({
      id: c.id,
      name: c.name,
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
      categories,
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
      categories: [],
      message: err.message || "Could not load services",
      messageType: "error",
    });
  }
}

async function adminCreateService(req, res) {
  const {
    service_name,
    service_description,
    category_id,
    service_duration_min,
    service_price,
    service_is_active,
  } = req.body;
  try {
    if (!service_name?.trim()) {
      return res.redirect(
        buildRedirectPath(
          "/views/admin-services",
          "Service name is required.",
          "error",
        ),
      );
    }
    if (!category_id) {
      return res.redirect(
        buildRedirectPath(
          "/views/admin-services",
          "Category is required.",
          "error",
        ),
      );
    }
    await ServicesService.createService({
      service_name: service_name.trim(),
      service_description: service_description?.trim() || null,
      category_id: Number(category_id),
      service_default_duration_min: Number(service_duration_min) || 30,
      service_base_price_cents: Number(service_price) || 0,
      service_is_active: service_is_active !== "false",
    });
    return res.redirect(
      buildRedirectPath(
        "/views/admin-services",
        "Service created successfully.",
      ),
    );
  } catch (err) {
    return res.redirect(
      buildRedirectPath(
        "/views/admin-services",
        err.message || "Could not create service.",
        "error",
      ),
    );
  }
}

async function adminUpdateService(req, res) {
  const svcId = req.params.id;
  const {
    service_name,
    service_description,
    category_id,
    service_duration_min,
    service_price,
    service_is_active,
  } = req.body;
  try {
    if (!service_name?.trim()) {
      return res.redirect(
        buildRedirectPath(
          "/views/admin-services",
          "Service name is required.",
          "error",
        ),
      );
    }
    if (!category_id) {
      return res.redirect(
        buildRedirectPath(
          "/views/admin-services",
          "Category is required.",
          "error",
        ),
      );
    }
    await ServicesService.updateService(svcId, {
      service_name: service_name.trim(),
      service_description: service_description?.trim() || null,
      category_id: Number(category_id),
      service_default_duration_min: Number(service_duration_min) || 30,
      service_base_price_cents: Number(service_price) || 0,
      service_is_active: service_is_active !== "false",
    });
    return res.redirect(
      buildRedirectPath(
        "/views/admin-services",
        "Service updated successfully.",
      ),
    );
  } catch (err) {
    return res.redirect(
      buildRedirectPath(
        "/views/admin-services",
        err.message || "Could not update service.",
        "error",
      ),
    );
  }
}

async function adminDeleteService(req, res) {
  const svcId = req.params.id;
  try {
    await ServicesService.deleteService(svcId);
    return res.redirect(
      buildRedirectPath(
        "/views/admin-services",
        "Service deleted successfully.",
      ),
    );
  } catch (err) {
    return res.redirect(
      buildRedirectPath(
        "/views/admin-services",
        err.message || "Could not delete service.",
        "error",
      ),
    );
  }
}

module.exports = {
  renderAdminServices,
  adminCreateService,
  adminUpdateService,
  adminDeleteService,
};
