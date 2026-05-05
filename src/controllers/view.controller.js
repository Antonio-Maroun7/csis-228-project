/**
 * ViewController handles EJS page rendering.
 * It uses the existing backend service layer instead of inventing new endpoints.
 */

const AuthService = require("../services/auth.service");
const CategoryService = require("../services/category.service");

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

function clearAuthCookie(res) {
  res.clearCookie("auth_token", {
    httpOnly: true,
    sameSite: "lax",
  });
}

function getUserRole(user) {
  return user?.role || user?.user_role || "client";
}

function redirectByRole(res, user, message = "Login successful") {
  const role = getUserRole(user);

  if (role === "admin") {
    return res.redirect(buildRedirectPath("/views/admin-dashboard", message));
  }

  if (role === "staff") {
    return res.redirect(buildRedirectPath("/views/staff-dashboard", message));
  }

  return res.redirect(buildRedirectPath("/views/client-home", message));
}

function getCategoryIcon(categoryName = "") {
  const name = String(categoryName).toLowerCase();

  if (name.includes("hair")) return "💇";
  if (name.includes("skin")) return "🧖";
  if (name.includes("medical")) return "🩺";
  if (name.includes("consult")) return "🩺";
  if (name.includes("physio")) return "🧘";
  if (name.includes("therapy")) return "🧘";
  if (name.includes("salon")) return "✂️";
  if (name.includes("advisor")) return "💬";
  if (name.includes("advisory")) return "💬";

  return "▦";
}

function decorateCategoriesForView(categories = []) {
  return categories
    .filter((category) => category && category.is_active !== false)
    .map((category, index) => {
      const categoryName =
        category.name || category.category_name || "Category";

      return {
        id: category.id || category.category_id,
        name: categoryName,
        description:
          category.description ||
          category.category_description ||
          "Explore available services and book your appointment",
        servicesCount: Number(
          category.servicesCount ||
            category.services_count ||
            category.service_count ||
            0,
        ),
        icon: getCategoryIcon(categoryName),
        featured: index === 1,
      };
    });
}

function capitalizeName(value) {
  if (!value) return "Client";

  const text = String(value).trim();

  if (!text) return "Client";

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function extractFirstName(value) {
  if (!value) return "Client";

  let text = String(value).trim();

  if (!text) return "Client";

  /*
    Email example:
    antoniomaroun@gmail.com -> antoniomaroun
  */
  if (text.includes("@")) {
    text = text.split("@")[0];
  }

  /*
    Separator examples:
    antonio.maroun -> antonio maroun
    antonio_maroun -> antonio maroun
    antonio-maroun -> antonio maroun
  */
  text = text
    .replace(/[0-9]/g, "")
    .replace(/[._-]+/g, " ")
    .trim();

  const parts = text.split(/\s+/).filter(Boolean);

  /*
    Full name example:
    Antonio Maroun -> Antonio
  */
  if (parts.length > 1) {
    return capitalizeName(parts[0]);
  }

  let singleValue = parts[0] || text;
  const lowerValue = singleValue.toLowerCase();

  /*
    Joined email username example:
    antoniomaroun -> Antonio
  */
  const knownFirstNames = [
    "antonio",
    "john",
    "jane",
    "maria",
    "marie",
    "mohammad",
    "mohammed",
    "ahmad",
    "ali",
    "hassan",
    "hussein",
    "george",
    "elie",
    "joe",
    "charbel",
    "mike",
    "sarah",
    "priya",
    "samir",
    "maroun",
    "gaby",
    "aoutillios",
    "elie",
  ];

  const matchedName = knownFirstNames.find((name) =>
    lowerValue.startsWith(name),
  );

  if (matchedName) {
    singleValue = matchedName;
  }

  return capitalizeName(singleValue);
}

function getFirstName(user) {
  const userFullName =
    user?.user_fullname ||
    user?.full_name ||
    user?.fullname ||
    user?.name ||
    user?.user_name ||
    user?.user_email ||
    user?.email ||
    "Client";

  return extractFirstName(userFullName);
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
      console.log("Login attempt with data:", req.body);

      const result = await AuthService.login(req.body);

      setAuthCookie(res, result.token);

      return redirectByRole(res, result.data, "Login successful");
    } catch (err) {
      console.log("Login error:", err.message);

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
    console.log("Registration attempt with data:", req.body);

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
          buildRedirectPath(
            "/views/register",
            "Passwords do not match",
            "error",
          ),
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
      console.log("Registration error:", err.message);

      return res.redirect(
        buildRedirectPath("/views/register", err.message, "error"),
      );
    }
  }

  static async renderDashboard(req, res) {
    return redirectByRole(res, req.user, "Welcome back");
  }

  static async renderClientHome(req, res) {
    try {
      const dbcategories = await CategoryService.getAllCategories();
      const categories = decorateCategoriesForView(dbcategories);

      const user = req.user || null;
      const firstName = getFirstName(user);

      return res.render("client-home", {
        title: "Client Home",
        user,
        firstName,
        role: "client",
        activePage: "client-home",
        breadcrumbMain: "Home",
        breadcrumbSub: "Categories",
        categories,
        stats: {
          availableCategories: categories.length,
          upcomingAppointments: 0,
          favoriteServices: 0,
        },
        message: req.query?.type === "error" ? req.query.message : null,
        messageType: req.query?.type || null,
      });
    } catch (err) {
      const user = req.user || null;
      const firstName = getFirstName(user);

      return res.status(500).render("client-home", {
        title: "Client Home",
        user,
        firstName,
        role: "client",
        activePage: "client-home",
        breadcrumbMain: "Home",
        breadcrumbSub: "Categories",
        categories: [],
        stats: {
          availableCategories: 0,
          upcomingAppointments: 0,
          favoriteServices: 0,
        },
        message: err.message || "Could not load categories",
        messageType: "error",
      });
    }
  }

  static async logout(req, res) {
    clearAuthCookie(res);

    return res.redirect(
      buildRedirectPath("/views/login", "Logged out successfully"),
    );
  }

  static renderNotAuthorized(req, res) {
    return res.status(403).render("not-authorized", {
      title: "Not Authorized",
      user: req.user || null,
    });
  }
}

module.exports = ViewController;
