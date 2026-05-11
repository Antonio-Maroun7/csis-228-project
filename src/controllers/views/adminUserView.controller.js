"use strict";

const UserService = require("../../services/user.service");
const {
  buildFeedbackState,
  buildRedirectPath,
} = require("../../utils/views/feedback.util");
const {
  getFirstName,
  getLoggedInUser,
} = require("../../utils/views/userView.util");

async function renderManageUsers(req, res) {
  try {
    const user = await getLoggedInUser(req);
    const firstName = getFirstName(user);

    const allUsers = await UserService.getAllUsers();

    return res.render("admin/manage-users", {
      title: "Manage Users",
      user,
      firstName,
      role: "admin",
      activePage: "manage-users",
      breadcrumbMain: "Home",
      breadcrumbSub: "Manage Users",
      users: allUsers,
      ...buildFeedbackState(req),
    });
  } catch (err) {
    const user = req.user || null;
    const firstName = getFirstName(user);

    return res.render("admin/manage-users", {
      title: "Manage Users",
      user,
      firstName,
      role: "admin",
      activePage: "manage-users",
      breadcrumbMain: "Home",
      breadcrumbSub: "Manage Users",
      users: [],
      message: err.message || "Could not load users",
      messageType: "error",
    });
  }
}

async function adminCreateUser(req, res) {
  const {
    user_fullname,
    user_email,
    user_phone,
    user_password,
    user_role,
    user_is_active,
  } = req.body;
  try {
    if (!user_fullname?.trim() || !user_email?.trim() || !user_password) {
      return res.redirect(
        buildRedirectPath(
          "/views/manage-users",
          "Full name, email, and password are required.",
          "error",
        ),
      );
    }
    await UserService.adminCreateUser({
      user_fullname: user_fullname.trim(),
      user_email: user_email.trim().toLowerCase(),
      user_phone: user_phone?.trim() || null,
      user_password,
      user_role: user_role || "client",
      user_is_active: user_is_active !== "false",
    });
    return res.redirect(
      buildRedirectPath("/views/manage-users", "User created successfully."),
    );
  } catch (err) {
    return res.redirect(
      buildRedirectPath(
        "/views/manage-users",
        err.message || "Could not create user.",
        "error",
      ),
    );
  }
}

async function adminUpdateUser(req, res) {
  const userId = req.params.id;
  const { user_fullname, user_email, user_phone, user_role, user_is_active } =
    req.body;
  try {
    if (!user_fullname?.trim() || !user_email?.trim()) {
      return res.redirect(
        buildRedirectPath(
          "/views/manage-users",
          "Full name and email are required.",
          "error",
        ),
      );
    }
    await UserService.UpdateUser(userId, {
      user_fullname: user_fullname.trim(),
      user_email: user_email.trim().toLowerCase(),
      user_role: user_role || "client",
      user_phone: user_phone?.trim() || null,
      user_is_active: user_is_active !== "false",
    });
    return res.redirect(
      buildRedirectPath("/views/manage-users", "User updated successfully."),
    );
  } catch (err) {
    return res.redirect(
      buildRedirectPath(
        "/views/manage-users",
        err.message || "Could not update user.",
        "error",
      ),
    );
  }
}

async function adminDeleteUser(req, res) {
  const userId = req.params.id;
  try {
    const loggedUser = await getLoggedInUser(req);
    if (loggedUser && String(loggedUser.id) === String(userId)) {
      return res.redirect(
        buildRedirectPath(
          "/views/manage-users",
          "You cannot delete your own account.",
          "error",
        ),
      );
    }
    await UserService.deleteUser(userId);
    return res.redirect(
      buildRedirectPath("/views/manage-users", "User deleted successfully."),
    );
  } catch (err) {
    return res.redirect(
      buildRedirectPath(
        "/views/manage-users",
        err.message || "Could not delete user.",
        "error",
      ),
    );
  }
}

module.exports = {
  renderManageUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
};
