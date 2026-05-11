"use strict";

const CategoryService = require("../../services/category.service");
const {
  buildFeedbackState,
  buildRedirectPath,
} = require("../../utils/views/feedback.util");
const {
  getFirstName,
  getLoggedInUser,
} = require("../../utils/views/userView.util");

async function renderAdminCategories(req, res) {
  try {
    const user = await getLoggedInUser(req);
    const firstName = getFirstName(user);

    const dbCategories = await CategoryService.getAllCategories();

    const categories = dbCategories.map((c) => ({
      id: c.id,
      name: c.name || "Category",
      description: c.description || "",
      isActive: c.is_active !== false,
      servicesCount: Number(c.servicesCount || 0),
    }));

    return res.render("admin/admin-categories", {
      title: "Categories",
      user,
      firstName,
      role: "admin",
      activePage: "admin-categories",
      categories,
      ...buildFeedbackState(req),
    });
  } catch (err) {
    const user = req.user || null;
    const firstName = getFirstName(user);

    return res.render("admin/admin-categories", {
      title: "Categories",
      user,
      firstName,
      role: "admin",
      activePage: "admin-categories",
      categories: [],
      message: err.message || "Could not load categories",
      messageType: "error",
    });
  }
}

async function adminCreateCategory(req, res) {
  const { category_name, category_description, category_is_active } = req.body;
  try {
    if (!category_name?.trim()) {
      return res.redirect(
        buildRedirectPath(
          "/views/admin-categories",
          "Category name is required.",
          "error",
        ),
      );
    }
    await CategoryService.createCategory({
      category_name: category_name.trim(),
      category_description: category_description?.trim() || null,
      category_is_active: category_is_active !== "false",
    });
    return res.redirect(
      buildRedirectPath(
        "/views/admin-categories",
        "Category created successfully.",
      ),
    );
  } catch (err) {
    return res.redirect(
      buildRedirectPath(
        "/views/admin-categories",
        err.message || "Could not create category.",
        "error",
      ),
    );
  }
}

async function adminUpdateCategory(req, res) {
  const catId = req.params.id;
  const { category_name, category_description, category_is_active } = req.body;
  try {
    if (!category_name?.trim()) {
      return res.redirect(
        buildRedirectPath(
          "/views/admin-categories",
          "Category name is required.",
          "error",
        ),
      );
    }
    await CategoryService.updateCategory(catId, {
      category_name: category_name.trim(),
      category_description: category_description?.trim() || null,
      category_is_active: category_is_active !== "false",
    });
    return res.redirect(
      buildRedirectPath(
        "/views/admin-categories",
        "Category updated successfully.",
      ),
    );
  } catch (err) {
    return res.redirect(
      buildRedirectPath(
        "/views/admin-categories",
        err.message || "Could not update category.",
        "error",
      ),
    );
  }
}

async function adminDeleteCategory(req, res) {
  const catId = req.params.id;
  try {
    await CategoryService.deleteCategory(catId);
    return res.redirect(
      buildRedirectPath(
        "/views/admin-categories",
        "Category deleted successfully.",
      ),
    );
  } catch (err) {
    return res.redirect(
      buildRedirectPath(
        "/views/admin-categories",
        err.message || "Could not delete category.",
        "error",
      ),
    );
  }
}

module.exports = {
  renderAdminCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
};
