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

// this function is for user to logout from the frontend application, it clear the auth cookie
function clearAuthCookie(res) {
  res.clearCookie("auth_token", {
    httpOnly: true,
    sameSite: "lax",
  });
}

//this function it will get the user role from the token ,even if the role field name is different in different places.
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
  const name = categoryName.toLowerCase();

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
      return {
        id: category.id,
        name: category.name,
        description:
          category.description ||
          "Explore available services and book your appointment",
        servicesCount: Number(category.servicesCount || 0),
        icon: getCategoryIcon(category.name),
        featured: index === 1,
      };
    });
}

//this function is implemented to put the first name of the user in the topBar dashboard,
//and this function check many fields names depending on the source (database ,token ,dto)
function getFirstName(user) {
  const userFullName =
    user?.user_fullname ||
    user?.fullname ||
    user?.name ||
    user?.email ||
    "Client";

  return userFullName.split("@")[0].split(" ")[0];
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
        title: "client-Home",
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
        ...buildFeedbackState(req),
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
}

module.exports = ViewController;
