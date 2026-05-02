/**
 * ViewController handles EJS page rendering.
 * It uses the existing backend service layer instead of inventing new endpoints.
 */
const AuthService = require("../services/auth.service");
function buildFeedbackState(req) {
  return {
    message: req.query.message || null,
    messageType: req.query.type === "error" ? "error" : "success",
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
      const result = await AuthService.login(req.body);
      setAuthCookie(res, result.token);

      return res.redirect(
        buildRedirectPath("/views/dashboard", "Login successful"),
      );
    } catch (err) {
      return res.redirect(
        buildRedirectPath("/views/login", err.message, "error"),
      );
    }
  }
  static async renderRegister(req, res) {
    return res.render("register", {
      title: "Register",
      ...buildFeedbackState(req),
    });
  }

  static async register(req, res) {
    try {
      const result = await AuthService.register(req.body);

      setAuthCookie(res, result.token);

      return res.redirect(
        buildFeedbackState("/views/dashboard", "Registration successful"),
      );
    } catch (err) {
      return res.redirect(
        buildFeedbackState("/views/register", err.message, "error"),
      );
    }
  }
}

module.exports = ViewController;
