"use strict";

const AppointmentService = require("../../services/appointment.service");
const { buildFeedbackState } = require("../../utils/views/feedback.util");
const {
  getLoggedInUser,
  getFirstName,
} = require("../../utils/views/userView.util");

/**
 * Builds a calendar data structure for the given year/month.
 * Returns an array of week arrays, each containing day objects.
 * @param {number} year
 * @param {number} month  1-based month
 * @param {Date[]} busyDates  array of appointment start dates
 * @returns {Array<Array<{day: number|null, isToday: boolean, isBusy: boolean}>>}
 */
function buildCalendarData(year, month, busyDates) {
  const today = new Date();
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  // Gather days that have appointments
  const busyDaySet = new Set();
  for (const d of busyDates) {
    const dt = new Date(d);
    if (dt.getFullYear() === year && dt.getMonth() + 1 === month) {
      busyDaySet.add(dt.getDate());
    }
  }

  const weeks = [];
  let week = new Array(firstDay.getDay()).fill(null); // leading nulls (Sun=0)

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const isToday =
      today.getFullYear() === year &&
      today.getMonth() + 1 === month &&
      today.getDate() === d;

    week.push({ day: d, isToday, isBusy: busyDaySet.has(d) });

    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  // Trailing nulls to fill last row
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  return weeks;
}

/**
 * Formats a date to "HH:MM AM/PM".
 * @param {Date|string} dt
 * @returns {string}
 */
function fmtTime(dt) {
  const d = new Date(dt);
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${String(h).padStart(2, "0")}:${m} ${ampm}`;
}

/**
 * Returns first name initial + last name initial for an avatar.
 * @param {string} fullName
 * @returns {string}
 */
function getInitials(fullName) {
  if (!fullName) return "?";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Renders the staff dashboard.
 */
async function renderStaffDashboard(req, res) {
  try {
    const user = await getLoggedInUser(req);
    const staffId = user?.user_id || user?.id;
    const firstName = getFirstName(user);
    const { message, messageType } = buildFeedbackState(req);

    const allAppointments =
      await AppointmentService.getStaffAppointmentsRich(staffId);

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const todayEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );

    // --- Parse selected date from ?date=YYYY-MM-DD query param ---
    const qDate = req.query.date;
    let selectedDate, selectedYear, selectedMonth, selectedDay;
    if (qDate && /^\d{4}-\d{2}-\d{2}$/.test(qDate)) {
      const [y, m, d] = qDate.split("-").map(Number);
      const testDate = new Date(y, m - 1, d);
      if (
        testDate.getFullYear() === y &&
        testDate.getMonth() + 1 === m &&
        testDate.getDate() === d
      ) {
        selectedYear = y;
        selectedMonth = m;
        selectedDay = d;
        selectedDate = qDate;
      }
    }
    if (!selectedDate) {
      selectedYear = now.getFullYear();
      selectedMonth = now.getMonth() + 1;
      selectedDay = now.getDate();
      selectedDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
    }

    // Build label for the schedule card header
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const selectedDateLabel =
      selectedDate === todayStr
        ? "Today's Schedule"
        : new Date(
            selectedYear,
            selectedMonth - 1,
            selectedDay,
          ).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });

    // Date range for schedule display (may differ from actual today)
    const selStart = new Date(selectedYear, selectedMonth - 1, selectedDay);
    const selEnd = new Date(selectedYear, selectedMonth - 1, selectedDay + 1);

    // --- Schedule for the selected date (sorted by time) ---
    const todayRows = allAppointments
      .filter((a) => {
        const start = new Date(a.appointment_start_at);
        return start >= selStart && start < selEnd;
      })
      .sort(
        (a, b) =>
          new Date(a.appointment_start_at) - new Date(b.appointment_start_at),
      )
      .map((a) => ({
        id: a.appointment_id,
        timeStr: fmtTime(a.appointment_start_at),
        clientName: a.client_name || "—",
        clientInitials: getInitials(a.client_name || ""),
        serviceName: a.service_name || "—",
        durationMin: a.duration_min || 0,
        status: a.appointment_status || "pending",
      }));

    // --- Stats (always based on actual today, not selected date) ---
    const actualTodayRows = allAppointments.filter((a) => {
      const start = new Date(a.appointment_start_at);
      return start >= todayStart && start < todayEnd;
    });
    const completedToday = actualTodayRows.filter(
      (a) => a.appointment_status === "completed",
    ).length;

    // Week range: Mon–Sun containing today
    const dayOfWeek = now.getDay(); // 0=Sun
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - ((dayOfWeek + 6) % 7)); // Monday
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const weekTotal = allAppointments.filter((a) => {
      const start = new Date(a.appointment_start_at);
      return (
        start >= weekStart &&
        start < weekEnd &&
        a.appointment_status !== "cancelled"
      );
    }).length;

    // --- Upcoming appointments (future, not cancelled) ---
    const upcomingRows = allAppointments
      .filter((a) => {
        const start = new Date(a.appointment_start_at);
        return start >= todayEnd && a.appointment_status !== "cancelled";
      })
      .sort(
        (a, b) =>
          new Date(a.appointment_start_at) - new Date(b.appointment_start_at),
      )
      .slice(0, 5)
      .map((a) => {
        const start = new Date(a.appointment_start_at);
        const diffDays = Math.floor((start - todayStart) / 86400000);
        let dayLabel;
        if (diffDays === 1) {
          dayLabel = "Tomorrow";
        } else {
          dayLabel = start.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
        }
        return {
          id: a.appointment_id,
          dayLabel,
          timeStr: fmtTime(start),
          clientName: a.client_name || "—",
          clientInitials: getInitials(a.client_name || ""),
          serviceName: a.service_name || "—",
          durationMin: a.duration_min || 0,
          status: a.appointment_status || "pending",
        };
      });

    // --- Recent activity (last 5 appointments modified/created, descending by created_at) ---
    const recentActivity = allAppointments
      .slice() // copy
      .sort(
        (a, b) =>
          new Date(b.appointment_created_at) -
          new Date(a.appointment_created_at),
      )
      .slice(0, 5)
      .map((a) => {
        const status = a.appointment_status;
        let icon = "📅";
        let label = "New appointment";
        if (status === "completed") {
          icon = "✅";
          label = "Appointment completed";
        } else if (status === "confirmed") {
          icon = "✔️";
          label = "Appointment confirmed";
        } else if (status === "cancelled") {
          icon = "❌";
          label = "Appointment cancelled";
        }

        const createdAt = new Date(a.appointment_created_at);
        const diffMs = now - createdAt;
        const diffH = Math.floor(diffMs / 3600000);
        let timeAgo;
        if (diffH < 1) timeAgo = "Just now";
        else if (diffH < 24)
          timeAgo = `${diffH} hour${diffH !== 1 ? "s" : ""} ago`;
        else {
          const diffD = Math.floor(diffH / 24);
          timeAgo = `${diffD} day${diffD !== 1 ? "s" : ""} ago`;
        }

        const startDate = new Date(a.appointment_start_at).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          },
        );

        return {
          icon,
          title: label,
          description: `${a.service_name || "Service"} for ${a.client_name || "client"}`,
          timeAgo,
          startDate,
        };
      });

    // --- Calendar (supports ?calYear=YYYY&calMonth=M query params for nav) ---
    const qYear = parseInt(req.query.calYear, 10);
    const qMonth = parseInt(req.query.calMonth, 10);
    // Fall back to the selected date's month when no explicit cal params
    const calYear =
      !isNaN(qYear) && qYear > 2000 && qYear < 2100 ? qYear : selectedYear;
    const calMonth =
      !isNaN(qMonth) && qMonth >= 1 && qMonth <= 12 ? qMonth : selectedMonth;
    const monthName = new Date(calYear, calMonth - 1, 1).toLocaleDateString(
      "en-US",
      { month: "long" },
    );
    const busyDates = allAppointments
      .filter((a) => a.appointment_status !== "cancelled")
      .map((a) => a.appointment_start_at);
    const calendarWeeks = buildCalendarData(calYear, calMonth, busyDates);

    // Compute prev/next month links for calendar navigation
    const prevMonth = calMonth === 1 ? 12 : calMonth - 1;
    const prevYear = calMonth === 1 ? calYear - 1 : calYear;
    const nextMonth = calMonth === 12 ? 1 : calMonth + 1;
    const nextYear = calMonth === 12 ? calYear + 1 : calYear;

    const stats = {
      todayCount: actualTodayRows.length,
      todayUpcoming: actualTodayRows.filter((a) =>
        ["pending", "confirmed"].includes(a.appointment_status),
      ).length,
      completedToday,
      weekTotal,
      rating: "4.9",
    };

    res.render("staff/staff-dashboard", {
      title: "Dashboard",
      role: "staff",
      activePage: "staff-dashboard",
      firstName,
      message,
      messageType,
      stats,
      todayAppointments: todayRows,
      upcomingAppointments: upcomingRows,
      recentActivity,
      calendarWeeks,
      calYear,
      calMonth,
      monthName,
      prevMonth,
      prevYear,
      nextMonth,
      nextYear,
      selectedDate,
      selectedDay,
      selectedDateLabel,
    });
  } catch (err) {
    console.error(
      "[staffDashboardView] renderStaffDashboard error:",
      err.message,
    );
    res.render("staff/staff-dashboard", {
      title: "Dashboard",
      role: "staff",
      activePage: "staff-dashboard",
      firstName: "Staff",
      message: "Failed to load dashboard data.",
      messageType: "error",
      stats: {
        todayCount: 0,
        todayUpcoming: 0,
        completedToday: 0,
        weekTotal: 0,
        rating: "—",
      },
      todayAppointments: [],
      upcomingAppointments: [],
      recentActivity: [],
      calendarWeeks: [],
      calYear: new Date().getFullYear(),
      calMonth: new Date().getMonth() + 1,
      monthName: new Date().toLocaleDateString("en-US", { month: "long" }),
    });
  }
}

module.exports = { renderStaffDashboard };
