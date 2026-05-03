/**
 * ViewController handles EJS page rendering.
 * It uses the existing backend service layer instead of inventing new endpoints.
 */
const AuthService = require("../services/auth.service");

function buildFeedbackState(req = {}) {
  const query = req.query || {};

  return {
    message: query.message || null,
    messageType: query.type === "error" ? "error" : "success",
  };
}

function buildRedirectPath(basePath, message, type = "success") {
  const params = new URLSearchParams({ message, type });
  return `${basePath}?${params.toString()}`;
}

function setAuthCookie(res, token) {
  res.cookie("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
  });
}

class ViewController {
  static redirectToLogin(req, res) {
    return res.redirect("/views/login");
  }

  static renderLogin(req, res) {
    return res.render("login", {
      title: "Login",
      ...buildFeedbackState(req),
    });
  }

  static async login(req, res) {
    try {
      console.log("LOGIN BODY:", req.body);
      const result = await AuthService.login(req.body);

      setAuthCookie(res, result.token);

      return res.redirect(
        buildRedirectPath("/views/dashboard", "Login successful"),
      );
    } catch (err) {
      console.log(err.message);
      return res.redirect(
        buildRedirectPath("/views/login", err.message, "error"),
      );
    }
  }

  static renderRegister(req, res) {
    return res.render("register", {
      title: "Register",
      ...buildFeedbackState(req),
    });
  }

  static async register(req, res) {
    try {
      console.log("REGISTER BODY:", req.body);

      const result = await AuthService.register(req.body);

      setAuthCookie(res, result.token);

      return res.redirect(
        buildRedirectPath("/views/dashboard", "Registration successful"),
      );
    } catch (err) {
      console.log(err.message);

      return res.redirect(
        buildRedirectPath("/views/register", err.message, "error"),
      );
    }
  }
}

module.exports = ViewController;
