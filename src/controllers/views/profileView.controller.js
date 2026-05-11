"use strict";

const UserService = require("../../services/user.service");
const {
  buildFeedbackState,
  buildRedirectPath,
} = require("../../utils/views/feedback.util");
const {
  getUserRole,
  getFirstName,
  getLoggedInUser,
} = require("../../utils/views/userView.util");

async function renderProfile(req, res) {
  try {
    const user = await getLoggedInUser(req);
    const firstName = getFirstName(user);
    const role = getUserRole(user);

    const activePageMap = {
      client: "profile",
      staff: "staff-profile",
      admin: "admin-profile",
    };

    const redirectPathMap = {
      client: "/views/profile",
      staff: "/views/staff-profile",
      admin: "/views/admin-profile",
    };

    return res.render("client/profile", {
      title: "Profile",
      user,
      firstName,
      role,
      activePage: activePageMap[role] || "profile",
      profileRedirectPath: redirectPathMap[role] || "/views/profile",
      breadcrumbMain: "Home",
      breadcrumbSub: "Profile",
      ...buildFeedbackState(req),
    });
  } catch (err) {
    const role = getUserRole(req.user);
    const redirectPathMap = {
      client: "/views/client-home",
      staff: "/views/staff-dashboard",
      admin: "/views/admin-dashboard",
    };

    return res.redirect(
      buildRedirectPath(
        redirectPathMap[role] || "/views/client-home",
        err.message || "Could not load profile",
        "error",
      ),
    );
  }
}

async function updateProfile(req, res) {
  const role = getUserRole(req.user);
  const redirectPathMap = {
    client: "/views/profile",
    staff: "/views/staff-profile",
    admin: "/views/admin-profile",
  };
  const redirectPath = redirectPathMap[role] || "/views/profile";

  try {
    const { user_fullname, user_email, user_phone } = req.body;

    if (!user_fullname || !String(user_fullname).trim()) {
      throw new Error("Full name is required.");
    }
    if (!user_email || !String(user_email).trim()) {
      throw new Error("Email address is required.");
    }

    const dbUser = await getLoggedInUser(req);

    await UserService.UpdateUser(dbUser.id, {
      user_fullname: String(user_fullname).trim(),
      user_email: String(user_email).trim(),
      user_role: dbUser.role,
      user_phone: user_phone ? String(user_phone).trim() : null,
      user_is_active: dbUser.is_active !== false,
    });

    return res.redirect(
      buildRedirectPath(redirectPath, "Profile updated successfully."),
    );
  } catch (err) {
    return res.redirect(
      buildRedirectPath(
        redirectPath,
        err.message || "Profile update failed.",
        "error",
      ),
    );
  }
}

async function changePassword(req, res) {
  const role = getUserRole(req.user);
  const redirectPathMap = {
    client: "/views/profile",
    staff: "/views/staff-profile",
    admin: "/views/admin-profile",
  };
  const redirectPath = redirectPathMap[role] || "/views/profile";

  try {
    const { current_password, new_password, confirm_password } = req.body;

    if (!current_password || !new_password || !confirm_password) {
      throw new Error("Please fill in all password fields.");
    }

    if (new_password !== confirm_password) {
      throw new Error("New passwords do not match.");
    }

    if (new_password.length < 6) {
      throw new Error("New password must be at least 6 characters.");
    }

    const dbUser = await getLoggedInUser(req);
    const email = dbUser?.email || dbUser?.user_email;

    await UserService.changePasswordByEmail(
      email,
      current_password,
      new_password,
    );

    return res.redirect(
      buildRedirectPath(redirectPath, "Password changed successfully."),
    );
  } catch (err) {
    return res.redirect(
      buildRedirectPath(
        redirectPath,
        err.message || "Password change failed.",
        "error",
      ),
    );
  }
}

module.exports = { renderProfile, updateProfile, changePassword };
