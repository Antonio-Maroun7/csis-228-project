"use strict";

const AuthService = require("../../services/auth.service");
const {
  buildFeedbackState,
  buildRedirectPath,
} = require("../../utils/views/feedback.util");
const {
  setAuthCookie,
  clearAuthCookie,
} = require("../../utils/views/authCookie.util");
const { redirectByRole } = require("../../utils/views/userView.util");

function redirectToLogin(req, res) {
  return res.redirect("/views/login");
}

function renderLogin(req, res) {
  return res.render("login", {
    title: "Login",
    ...buildFeedbackState(req),
  });
}

async function login(req, res) {
  try {
    const result = await AuthService.login(req.body);
    setAuthCookie(res, result.token);
    return redirectByRole(res, result.data, "Login successful");
  } catch (err) {
    return res.redirect(
      buildRedirectPath("/views/login", err.message, "error"),
    );
  }
}

function renderRegister(req, res) {
  return res.render("register", {
    title: "Register",
    ...buildFeedbackState(req),
  });
}

async function register(req, res) {
  try {
    const {
      user_name,
      user_email,
      user_phone,
      user_password,
      confirm_password,
    } = req.body;

    if (user_password !== confirm_password) {
      return res.redirect(
        buildRedirectPath("/views/register", "Passwords do not match", "error"),
      );
    }

    const result = await AuthService.register({
      user_fullname: user_name,
      user_email,
      user_phone,
      user_password,
    });

    setAuthCookie(res, result.token);

    return redirectByRole(res, result.data, "Registration successful");
  } catch (err) {
    return res.redirect(
      buildRedirectPath("/views/register", err.message, "error"),
    );
  }
}

async function renderDashboard(req, res) {
  return redirectByRole(res, req.user, "Welcome back");
}

async function logout(req, res) {
  clearAuthCookie(res);

  return res.redirect(
    buildRedirectPath("/views/login", "Logged out successfully"),
  );
}

function renderNotAuthorized(req, res) {
  return res.status(403).render("not-authorized", {
    title: "Not Authorized",
    user: req.user || null,
  });
}

module.exports = {
  redirectToLogin,
  renderLogin,
  login,
  renderRegister,
  register,
  renderDashboard,
  logout,
  renderNotAuthorized,
};
