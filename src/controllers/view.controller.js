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

const MONTH_ABBRS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function decorateAppointmentsForView(rows = []) {
  return rows.map((row) => {
    const rawStart = row.appointment_start_at
      ? new Date(row.appointment_start_at)
      : null;

    let dayNum = "";
    let monthAbbr = "";
    let yearNum = "";
    let timeStr = "";

    if (rawStart && !isNaN(rawStart.getTime())) {
      dayNum = String(rawStart.getDate()).padStart(2, "0");
      monthAbbr = MONTH_ABBRS[rawStart.getMonth()];
      yearNum = rawStart.getFullYear();
      const h = rawStart.getHours();
      const m = String(rawStart.getMinutes()).padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 === 0 ? 12 : h % 12;
      timeStr = `${String(h12).padStart(2, "0")}:${m} ${ampm}`;
    }

    const status = row.appointment_status || "pending";
    const canCancel = ["pending", "confirmed"].includes(status);

    return {
      id: row.appointment_id,
      serviceId: row.service_id || null,
      rawStartAt: rawStart,
      dayNum,
      monthAbbr,
      yearNum,
      timeStr,
      status,
      canCancel,
      staffName: row.staff_name || "TBA",
      serviceName: row.service_name || null,
      categoryName: row.category_name || "",
      durationMin: Number(
        row.duration_min ?? row.appointment_duration_min ?? 0,
      ),
      priceLabel: formatPrice(
        row.price_cents != null ? row.price_cents : row.appointment_price_cents,
      ),
      notes: row.appointment_notes || "",
      createdAt: row.appointment_created_at || null,
    };
  });
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

function decorateAdminAppointmentsForView(rows = []) {
  return rows.map((row) => {
    const rawStart = row.appointment_start_at
      ? new Date(row.appointment_start_at)
      : null;

    let dateTimeStr = "";

    if (rawStart && !isNaN(rawStart.getTime())) {
      const day = String(rawStart.getDate()).padStart(2, "0");
      const month = MONTH_ABBRS[rawStart.getMonth()];
      const year = rawStart.getFullYear();
      const h = rawStart.getHours();
      const m = String(rawStart.getMinutes()).padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 === 0 ? 12 : h % 12;
      dateTimeStr = `${month} ${day} ${year} ${String(h12).padStart(2, "0")}:${m} ${ampm}`;
    }

    const dateStr =
      rawStart && !isNaN(rawStart.getTime())
        ? `${MONTH_ABBRS[rawStart.getMonth()]} ${String(rawStart.getDate()).padStart(2, "0")}, ${rawStart.getFullYear()}`
        : "";
    const timeStr =
      rawStart && !isNaN(rawStart.getTime())
        ? (() => {
            const h = rawStart.getHours();
            const m = String(rawStart.getMinutes()).padStart(2, "0");
            const ampm = h >= 12 ? "PM" : "AM";
            const h12 = h % 12 === 0 ? 12 : h % 12;
            return `${String(h12).padStart(2, "0")}:${m} ${ampm}`;
          })()
        : "";

    const status = row.appointment_status || "pending";
    const clientInitials = (row.client_name || "?")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase())
      .join("");

    return {
      id: row.appointment_id,
      clientName: row.client_name || "Unknown Client",
      clientEmail: row.client_email || "",
      clientInitials,
      staffName: row.staff_name || "TBA",
      serviceName: row.service_name || "N/A",
      categoryName: row.category_name || "",
      dateTimeStr,
      dateStr,
      timeStr,
      rawStartAt: rawStart,
      status,
      priceLabel: formatPrice(row.price_cents || 0),
      durationMin: Number(row.duration_min || 0),
      notes: row.appointment_notes || "",
    };
  });
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

  /* ── My Appointments ───────────────────────────────────────── */

  static async renderMyAppointments(req, res) {
    try {
      const user = await getLoggedInUser(req);
      const firstName = getFirstName(user);
      const clientId = user?.id || user?.user_id;

      const rows = await AppointmentService.getClientAppointmentsRich(clientId);
      const appointments = decorateAppointmentsForView(rows);

      const now = new Date();
      const stats = {
        total: appointments.length,
        upcoming: appointments.filter(
          (a) =>
            ["pending", "confirmed"].includes(a.status) &&
            a.rawStartAt &&
            a.rawStartAt >= now,
        ).length,
        completed: appointments.filter((a) => a.status === "completed").length,
        cancelled: appointments.filter((a) => a.status === "cancelled").length,
      };

      return res.render("my-appointments", {
        title: "My Appointments",
        user,
        firstName,
        role: "client",
        activePage: "my-appointments",
        breadcrumbMain: "Home",
        breadcrumbSub: "My Appointments",
        appointments,
        stats,
        ...buildFeedbackState(req),
      });
    } catch (err) {
      const user = req.user || null;
      const firstName = getFirstName(user);

      return res.render("my-appointments", {
        title: "My Appointments",
        user,
        firstName,
        role: "client",
        activePage: "my-appointments",
        breadcrumbMain: "Home",
        breadcrumbSub: "My Appointments",
        appointments: [],
        stats: { total: 0, upcoming: 0, completed: 0, cancelled: 0 },
        message: err.message || "Could not load appointments",
        messageType: "error",
      });
    }
  }

  static async cancelMyAppointment(req, res) {
    const appointmentId = req.params.id;

    try {
      await AppointmentService.cancelAppointment(appointmentId);

      return res.redirect(
        buildRedirectPath(
          "/views/my-appointments",
          "Appointment cancelled successfully.",
        ),
      );
    } catch (err) {
      return res.redirect(
        buildRedirectPath(
          "/views/my-appointments",
          err.message || "Could not cancel appointment.",
          "error",
        ),
      );
    }
  }

  /* ── Profile ───────────────────────────────────────────────── */

  static async renderProfile(req, res) {
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

      return res.render("profile", {
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

  static async updateProfile(req, res) {
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

  static async changePassword(req, res) {
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

  /* ── Admin Dashboard ───────────────────────────────────────── */

  static async renderAdminDashboard(req, res) {
    try {
      const user = await getLoggedInUser(req);
      const firstName = getFirstName(user);

      const [allUsers, allCategories, allServices, allAppointments] =
        await Promise.all([
          UserService.getAllUsers(),
          CategoryService.getAllCategories(),
          ServicesService.getServices(),
          AppointmentService.getAllAppointments(),
        ]);

      const stats = {
        totalUsers: allUsers.length,
        totalCategories: allCategories.length,
        totalServices: allServices.length,
        totalAppointments: allAppointments.length,
        pendingAppointments: allAppointments.filter(
          (a) => (a.appointment_status || a.status) === "pending",
        ).length,
        completedAppointments: allAppointments.filter(
          (a) => (a.appointment_status || a.status) === "completed",
        ).length,
      };

      const recentAppointments = decorateAdminAppointmentsForView(
        allAppointments.slice(0, 10),
      );

      return res.render("admin-dashboard", {
        title: "Admin Dashboard",
        user,
        firstName,
        role: "admin",
        activePage: "admin-dashboard",
        breadcrumbMain: "Home",
        breadcrumbSub: "Admin Dashboard",
        stats,
        recentAppointments,
        ...buildFeedbackState(req),
      });
    } catch (err) {
      const user = req.user || null;
      const firstName = getFirstName(user);

      return res.render("admin-dashboard", {
        title: "Admin Dashboard",
        user,
        firstName,
        role: "admin",
        activePage: "admin-dashboard",
        breadcrumbMain: "Home",
        breadcrumbSub: "Admin Dashboard",
        stats: {
          totalUsers: 0,
          totalCategories: 0,
          totalServices: 0,
          totalAppointments: 0,
          pendingAppointments: 0,
          completedAppointments: 0,
        },
        recentAppointments: [],
        message: err.message || "Could not load dashboard data",
        messageType: "error",
      });
    }
  }

  /* ── Admin Manage Users ────────────────────────────────────── */

  static async renderManageUsers(req, res) {
    try {
      const user = await getLoggedInUser(req);
      const firstName = getFirstName(user);

      const allUsers = await UserService.getAllUsers();

      return res.render("manage-users", {
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

      return res.render("manage-users", {
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

  /* ── Admin Manage Users: CRUD Actions ─────────────────────── */

  static async adminCreateUser(req, res) {
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

  static async adminUpdateUser(req, res) {
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

  static async adminDeleteUser(req, res) {
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

  /* ── Admin Categories ──────────────────────────────────────── */

  static async renderAdminCategories(req, res) {
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

      return res.render("admin-categories", {
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

      return res.render("admin-categories", {
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

  static async adminCreateCategory(req, res) {
    const { category_name, category_description, category_is_active } =
      req.body;
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

  static async adminUpdateCategory(req, res) {
    const catId = req.params.id;
    const { category_name, category_description, category_is_active } =
      req.body;
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

  static async adminDeleteCategory(req, res) {
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

  /* ── Admin Services ────────────────────────────────────────── */

  static async renderAdminServices(req, res) {
    try {
      const user = await getLoggedInUser(req);
      const firstName = getFirstName(user);

      const dbServices = await ServicesService.getServices();

      const services = dbServices.map((s) => ({
        id: s.id || s.service_id,
        name: s.name || s.service_name || "Service",
        description: s.description || s.service_description || "",
        categoryId: s.category_id || s.categoryId,
        durationMin: Number(
          s.default_duration_min ||
            s.service_default_duration_min ||
            s.duration_min ||
            0,
        ),
        priceLabel: formatPrice(
          s.base_price_cents ||
            s.service_base_price_cents ||
            s.default_price_cents ||
            s.price_cents ||
            0,
        ),
        isActive: s.is_active !== false,
        icon: getServiceIcon(s.name || s.service_name || ""),
      }));

      return res.render("admin-services", {
        title: "Services",
        user,
        firstName,
        role: "admin",
        activePage: "admin-services",
        breadcrumbMain: "Home",
        breadcrumbSub: "Services",
        services,
        ...buildFeedbackState(req),
      });
    } catch (err) {
      const user = req.user || null;
      const firstName = getFirstName(user);

      return res.render("admin-services", {
        title: "Services",
        user,
        firstName,
        role: "admin",
        activePage: "admin-services",
        breadcrumbMain: "Home",
        breadcrumbSub: "Services",
        services: [],
        message: err.message || "Could not load services",
        messageType: "error",
      });
    }
  }

  /* ── Admin Staff Services ──────────────────────────────────── */

  static async renderAdminStaffServices(req, res) {
    try {
      const user = await getLoggedInUser(req);
      const firstName = getFirstName(user);

      const [allStaffServices, allUsers, allServices] = await Promise.all([
        StaffServiceService.getAllStaffServices(),
        UserService.getAllUsers(),
        ServicesService.getServices(),
      ]);

      const userMap = {};
      for (const u of allUsers) {
        userMap[u.id] = u;
      }

      const serviceMap = {};
      for (const s of allServices) {
        serviceMap[s.id || s.service_id] = s;
      }

      const staffServices = allStaffServices.map((ss) => {
        const staffUser = userMap[ss.staff_id] || null;
        const svc = serviceMap[ss.service_id] || null;
        return {
          staffId: ss.staff_id,
          serviceId: ss.service_id,
          staffName: staffUser
            ? staffUser.fullname || staffUser.user_fullname || "Staff"
            : `Staff #${ss.staff_id}`,
          serviceName: svc
            ? svc.name || svc.service_name || "Service"
            : `Service #${ss.service_id}`,
          durationMin: ss.duration_min || null,
          priceLabel: ss.price_cents ? formatPrice(ss.price_cents) : null,
        };
      });

      return res.render("admin-staff-services", {
        title: "Staff Services",
        user,
        firstName,
        role: "admin",
        activePage: "admin-staff-services",
        breadcrumbMain: "Home",
        breadcrumbSub: "Staff Services",
        staffServices,
        ...buildFeedbackState(req),
      });
    } catch (err) {
      const user = req.user || null;
      const firstName = getFirstName(user);

      return res.render("admin-staff-services", {
        title: "Staff Services",
        user,
        firstName,
        role: "admin",
        activePage: "admin-staff-services",
        breadcrumbMain: "Home",
        breadcrumbSub: "Staff Services",
        staffServices: [],
        message: err.message || "Could not load staff services",
        messageType: "error",
      });
    }
  }

  /* ── Admin Appointments ────────────────────────────────────── */

  static async renderAdminAppointments(req, res) {
    try {
      const user = await getLoggedInUser(req);
      const firstName = getFirstName(user);

      const allAppointments = await AppointmentService.getAllAppointments();
      const appointments = decorateAdminAppointmentsForView(allAppointments);

      return res.render("admin-appointments", {
        title: "All Appointments",
        user,
        firstName,
        role: "admin",
        activePage: "admin-appointments",
        breadcrumbMain: "Home",
        breadcrumbSub: "All Appointments",
        appointments,
        ...buildFeedbackState(req),
      });
    } catch (err) {
      const user = req.user || null;
      const firstName = getFirstName(user);

      return res.render("admin-appointments", {
        title: "All Appointments",
        user,
        firstName,
        role: "admin",
        activePage: "admin-appointments",
        breadcrumbMain: "Home",
        breadcrumbSub: "All Appointments",
        appointments: [],
        message: err.message || "Could not load appointments",
        messageType: "error",
      });
    }
  }
}

module.exports = ViewController;
