/**
 * ViewController handles EJS page rendering.
 */

const AuthService = require("../services/auth.service");
const CategoryService = require("../services/category.service");
const ServicesService = require("../services/services.service");
const AppointmentService = require("../services/appointment.service");
const StaffServiceService = require("../services/staffService.service");
const UserService = require("../services/user.service");

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

function getServiceIcon(serviceName = "") {
  const name = String(serviceName).toLowerCase();

  if (name.includes("wash")) return "🧴";
  if (name.includes("haircut")) return "✂️";
  if (name.includes("cut")) return "✂️";
  if (name.includes("color")) return "💆‍♀️";
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

function formatPrice(value) {
  const raw = Number(value) || 0;

  if (!raw) {
    return "Free";
  }

  /*
    Your DB column is named *_cents, but from your screenshot you are storing
    25 as $25. This keeps both cases working:
    25   -> $25
    2500 -> $25
  */
  const dollars = raw >= 1000 ? raw / 100 : raw;

  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
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

function decorateServicesForView(services = []) {
  return services
    .filter((service) => service && service.is_active !== false)
    .map((service, index) => {
      const serviceName = service.name || service.service_name || "Service";

      const durationMin =
        service.default_duration_min ||
        service.service_default_duration_min ||
        service.duration_min ||
        0;

      const priceValue =
        service.base_price_cents ||
        service.service_base_price_cents ||
        service.default_price_cents ||
        service.price_cents ||
        0;

      return {
        id: service.id || service.service_id,
        categoryId: service.category_id || service.categoryId,
        name: serviceName,
        description:
          service.description ||
          service.service_description ||
          "Professional service with trusted care.",
        durationMin: Number(durationMin) || 0,
        priceLabel: formatPrice(priceValue),
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

  if (text.includes("@")) {
    text = text.split("@")[0];
  }

  text = text
    .replace(/[0-9]/g, "")
    .replace(/[._-]+/g, " ")
    .trim();

  const parts = text.split(/\s+/).filter(Boolean);

  if (parts.length > 1) {
    return capitalizeName(parts[0]);
  }

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

function generateTimeSlots() {
  return [
    { label: "09:00 AM", value: "09:00" },
    { label: "10:30 AM", value: "10:30" },
    { label: "12:00 PM", value: "12:00" },
    { label: "02:00 PM", value: "14:00" },
    { label: "03:30 PM", value: "15:30" },
    { label: "05:00 PM", value: "17:00" },
  ];
}

async function getLoggedInUser(req) {
  const tokenUser = req.user || null;

  if (!tokenUser?.id) {
    return tokenUser;
  }

  try {
    return await UserService.getUserById(tokenUser.id);
  } catch (err) {
    return tokenUser;
  }
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

  static async renderClientHome(req, res) {
    try {
      const dbCategories = await CategoryService.getAllCategories();
      const categories = decorateCategoriesForView(dbCategories);

      const user = await getLoggedInUser(req);
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

  static async renderServicesByCategory(req, res) {
    try {
      const categoryId = req.params.categoryId;

      const dbCategory = await CategoryService.getCategoryById(categoryId);
      const dbServices =
        await ServicesService.getServicesByCategory(categoryId);

      const services = decorateServicesForView(dbServices);

      const categoryName =
        dbCategory.name || dbCategory.category_name || "Category";

      const user = await getLoggedInUser(req);
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

  static async renderBookAppointment(req, res) {
    try {
      const { serviceId } = req.params;

      const user = await getLoggedInUser(req);
      const firstName = getFirstName(user);

      const dbService = await ServicesService.getServiceById(serviceId);

      if (!dbService) {
        throw new Error("Service not found");
      }

      const categoryId = dbService.category_id || dbService.categoryId;
      let categoryName = "Categories";

      try {
        const dbCategory = await CategoryService.getCategoryById(categoryId);
        categoryName =
          dbCategory.name || dbCategory.category_name || "Categories";
      } catch (err) {
        categoryName = "Categories";
      }

      const dbStaff = await StaffServiceService.getStaffByService(serviceId);

      const serviceName =
        dbService.name || dbService.service_name || "Selected Service";

      const durationMin =
        dbService.default_duration_min ||
        dbService.service_default_duration_min ||
        dbService.duration_min ||
        0;

      const priceValue =
        dbService.base_price_cents ||
        dbService.service_base_price_cents ||
        dbService.default_price_cents ||
        dbService.price_cents ||
        0;

      const service = {
        id: dbService.id || dbService.service_id,
        categoryId,
        name: serviceName,
        description:
          dbService.description ||
          dbService.service_description ||
          "Professional service with trusted care.",
        durationMin: Number(durationMin) || 0,
        priceLabel: formatPrice(priceValue),
        icon: getServiceIcon(serviceName),
      };

      const staffList = (dbStaff || [])
        .filter((staff) => staff && staff.is_active !== false)
        .map((staff) => ({
          id: staff.id || staff.user_id,
          name:
            staff.fullname ||
            staff.user_fullname ||
            staff.name ||
            "Staff Member",
          email: staff.email || staff.user_email || "",
        }));

      const todayISO = new Date().toISOString().split("T")[0];

      return res.render("book-appointment", {
        title: `Book – ${service.name}`,
        user,
        firstName,
        userFullname:
          user?.fullname || user?.user_fullname || user?.name || firstName,
        userEmail: user?.email || user?.user_email || "",
        userPhone: user?.phone || user?.user_phone || "",
        role: "client",
        activePage: "book-appointment",
        breadcrumbMain: "Home",
        breadcrumbMiddle: categoryName,
        breadcrumbSub: "Book Appointment",
        service,
        categoryName,
        staffList,
        timeSlots: generateTimeSlots(),
        todayISO,
        stats: {
          upcomingAppointments: 0,
          favoriteServices: 0,
          nextAppointmentLabel: "Next one after booking",
        },
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

  static async bookAppointment(req, res) {
    const { service_id } = req.body;

    try {
      const user = req.user || {};
      const clientId = user.id || user.user_id;

      const {
        staff_id,
        appointment_date,
        appointment_time,
        appointment_notes,
      } = req.body;

      if (!clientId) {
        throw new Error("Please login again before booking.");
      }

      if (!service_id || !staff_id || !appointment_date || !appointment_time) {
        throw new Error(
          "Please select a staff member, date, and time before confirming.",
        );
      }

      const starts_at = new Date(`${appointment_date}T${appointment_time}:00`);

      if (Number.isNaN(starts_at.getTime())) {
        throw new Error("Invalid appointment date or time.");
      }

      await AppointmentService.createAppointment({
        client_id: Number(clientId),
        staff_id: Number(staff_id),
        starts_at,
        service_items: [Number(service_id)],
        appointment_notes: appointment_notes || null,
      });

      return res.redirect(
        buildRedirectPath(
          "/views/client-home",
          "Your appointment has been booked successfully!",
          "success",
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
