/**
 * ViewController handles EJS page rendering.
 * It uses the existing backend service layer instead of inventing new endpoints.
 */

const AuthService = require("../services/auth.service");
const CategoryService = require("../services/category.service");
const ServicesService = require("../services/services.service");
const AppointmentService = require("../services/appointment.service");
const StaffServiceService = require("../services/staffService.service");

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

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
  res.clearCookie("auth_token", { httpOnly: true, sameSite: "lax" });
}

function getUserRole(user) {
  return user?.role || user?.user_role || "client";
}

function redirectByRole(res, user, message = "Login successful") {
  const role = getUserRole(user);
  if (role === "admin")
    return res.redirect(buildRedirectPath("/views/admin-dashboard", message));
  if (role === "staff")
    return res.redirect(buildRedirectPath("/views/staff-dashboard", message));
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

function getServiceIcon(serviceName = "") {
  const name = String(serviceName).toLowerCase();
  if (name.includes("haircut")) return "✂️";
  if (name.includes("cut")) return "✂️";
  if (name.includes("color")) return "🎨";
  if (name.includes("blow")) return "💨";
  if (name.includes("styling")) return "💇";
  if (name.includes("keratin")) return "✨";
  if (name.includes("beard")) return "🧔";
  if (name.includes("facial")) return "🧖";
  if (name.includes("skin")) return "🧖";
  if (name.includes("massage")) return "💆";
  if (name.includes("doctor")) return "🩺";
  if (name.includes("consult")) return "🩺";
  if (name.includes("therapy")) return "🧘";
  if (name.includes("advisor")) return "💬";
  return "▦";
}

/**
 * Price is stored directly as dollars — no /100 conversion.
 * e.g. 75 → "$75"  |  75.5 → "$75.50"  |  0 → "Free"
 */
function formatPrice(value) {
  const dollar = Number(value) || 0;
  if (!dollar) return "Free";
  return Number.isInteger(dollar) ? `$${dollar}` : `$${dollar.toFixed(2)}`;
}

function decorateCategoriesForView(categories = []) {
  return categories
    .filter((c) => c && c.is_active !== false)
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
          category.servicesCount || category.services_count || 0,
        ),
        icon: getCategoryIcon(categoryName),
        featured: index === 1,
      };
    });
}

function decorateServicesForView(services = []) {
  return services
    .filter((s) => s && s.is_active !== false)
    .map((service, index) => {
      const serviceName = service.name || service.service_name || "Service";
      const durationMin =
        service.default_duration_min ||
        service.service_default_duration_min ||
        0;
      const priceDollars =
        service.base_price_cents || service.service_base_price_cents || 0;
      return {
        id: service.id || service.service_id,
        categoryId: service.category_id || service.categoryId,
        name: serviceName,
        description:
          service.description ||
          service.service_description ||
          "Professional service with trusted care.",
        durationMin: Number(durationMin) || 0,
        priceLabel: formatPrice(priceDollars),
        icon: getServiceIcon(serviceName),
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
  if (text.includes("@")) text = text.split("@")[0];
  text = text
    .replace(/[0-9]/g, "")
    .replace(/[._-]+/g, " ")
    .trim();
  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length > 1) return capitalizeName(parts[0]);
  let singleValue = parts[0] || text;
  const lowerValue = singleValue.toLowerCase();
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
  ];
  const matchedName = knownFirstNames.find((n) => lowerValue.startsWith(n));
  if (matchedName) singleValue = matchedName;
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

/**
 * Generates half-hour time slots from 09:00 to 17:30.
 * Returns [{ label: "09:00 AM", value: "09:00" }, ...]
 */
function generateTimeSlots() {
  const slots = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let min = 0; min < 60; min += 30) {
      if (hour === 17 && min > 30) break;
      const h12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const ampm = hour >= 12 ? "PM" : "AM";
      const label = `${String(h12).padStart(2, "0")}:${String(min).padStart(2, "0")} ${ampm}`;
      const value = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
      slots.push({ label, value });
    }
  }
  return slots;
}

/* ─────────────────────────────────────────────
   VIEW CONTROLLER
───────────────────────────────────────────── */

class ViewController {
  /* ── Auth ── */

  static redirectToLogin(req, res) {
    return res.redirect("/views/login");
  }

  static renderLogin(req, res) {
    return res.render("login", { title: "Login", ...buildFeedbackState(req) });
  }

  static async login(req, res) {
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

  static renderRegister(req, res) {
    return res.render("register", {
      title: "Register",
      ...buildFeedbackState(req),
    });
  }

  static async register(req, res) {
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
      return res.redirect(
        buildRedirectPath("/views/register", err.message, "error"),
      );
    }
  }

  static async renderDashboard(req, res) {
    return redirectByRole(res, req.user, "Welcome back");
  }

  /* ── Client Home ── */

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

  /* ── Services by Category ── */

  static async renderServicesByCategory(req, res) {
    try {
      const categoryId = req.params.categoryId;
      const dbCategories = await CategoryService.getAllCategories();
      const dbCategory =
        (dbCategories || []).find(
          (c) => String(c.id || c.category_id) === String(categoryId),
        ) || {};
      const dbServices =
        await ServicesService.getServicesByCategory(categoryId);
      const services = decorateServicesForView(dbServices);
      const categoryName =
        dbCategory.name || dbCategory.category_name || "Category";
      const user = req.user || null;
      const firstName = getFirstName(user);
      return res.render("services-by-category", {
        title: `${categoryName} Services`,
        user,
        firstName,
        role: "client",
        activePage: "client-home",
        breadcrumbMain: "Home",
        breadcrumbMiddle: "Categories",
        breadcrumbSub: categoryName,
        category: {
          id: dbCategory.id || categoryId,
          name: categoryName,
          description:
            dbCategory.description ||
            "Choose a service to view details and book your appointment.",
          icon: getCategoryIcon(categoryName),
        },
        services,
        stats: {
          availableServices: services.length,
          upcomingAppointments: 0,
          favoriteServices: 0,
        },
        message: req.query?.type === "error" ? req.query.message : null,
        messageType: req.query?.type || null,
      });
    } catch (err) {
      return res.redirect(
        buildRedirectPath(
          "/views/client-home",
          err.message || "Could not load services",
          "error",
        ),
      );
    }
  }

  /* ── Book Appointment (GET) ── */

  static async renderBookAppointment(req, res) {
    try {
      const { serviceId } = req.params;
      const user = req.user || null;
      const firstName = getFirstName(user);

      const dbService = await ServicesService.getServiceById(serviceId);
      if (!dbService) throw new Error("Service not found");

      const dbStaff = await StaffServiceService.getStaffByService(serviceId);
      const priceDollars = Number(dbService.base_price_cents) || 0;

      const service = {
        id: dbService.id,
        name: dbService.name || "Service",
        description:
          dbService.description || "Professional service with trusted care.",
        durationMin: Number(dbService.default_duration_min) || 0,
        price: priceDollars,
        priceLabel: formatPrice(priceDollars),
        icon: getServiceIcon(dbService.name),
        categoryId: dbService.category_id,
      };

      const staffList = (dbStaff || [])
        .filter((s) => s && s.is_active !== false)
        .map((s) => ({
          id: s.id,
          name: s.fullname || s.name || "Staff Member",
          email: s.email || "",
        }));

      const timeSlots = generateTimeSlots();
      const todayISO = new Date().toISOString().split("T")[0];
      const userFullname =
        user?.fullname || user?.user_fullname || user?.name || "";
      const userEmail = user?.email || user?.user_email || "";
      const userPhone = user?.phone || user?.user_phone || "";

      return res.render("book-appointment", {
        title: `Book – ${service.name}`,
        user,
        firstName,
        userFullname,
        userEmail,
        userPhone,
        role: "client",
        activePage: "book-appointment",
        breadcrumbMain: "Home",
        breadcrumbMiddle: "Categories",
        breadcrumbSub: "Book Appointment",
        service,
        staffList,
        timeSlots,
        todayISO,
        message: req.query?.type === "error" ? req.query.message : null,
        messageType: req.query?.type || null,
      });
    } catch (err) {
      return res.redirect(
        buildRedirectPath(
          "/views/client-home",
          err.message || "Could not load booking page",
          "error",
        ),
      );
    }
  }

  /* ── Book Appointment (POST) ── */

  static async bookAppointment(req, res) {
    const { service_id } = req.body;
    try {
      const user = req.user;
      const clientId = user?.id || user?.user_id;
      const {
        staff_id,
        appointment_date,
        appointment_time,
        appointment_notes,
      } = req.body;

      if (!staff_id || !appointment_date || !appointment_time) {
        throw new Error(
          "Please fill in all required fields (staff, date, and time).",
        );
      }

      const starts_at = new Date(`${appointment_date}T${appointment_time}:00`);
      if (Number.isNaN(starts_at.getTime())) {
        throw new Error("Invalid appointment date or time.");
      }

      await AppointmentService.createAppointment({
        client_id: clientId,
        staff_id: Number(staff_id),
        starts_at,
        service_items: [Number(service_id)],
        appointment_notes: appointment_notes || null,
      });

      return res.redirect(
        buildRedirectPath(
          "/views/my-appointments",
          "Your appointment has been booked successfully!",
        ),
      );
    } catch (err) {
      return res.redirect(
        buildRedirectPath(
          `/views/book-appointment/${service_id || ""}`,
          err.message || "Booking failed. Please try again.",
          "error",
        ),
      );
    }
  }

  /* ── Misc ── */

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
