"use strict";

const { formatPrice, MONTH_ABBRS } = require("./formatView.util");

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

    const staffInitials = (row.staff_name || "?")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase())
      .join("");

    const paymentStatusMap = {
      completed: "paid",
      confirmed: "paid",
      pending: "unpaid",
      no_show: "unpaid",
      cancelled: "refunded",
    };
    const paymentStatus = paymentStatusMap[status] || "unpaid";

    const aptId = `#APT-${String(row.appointment_id).padStart(5, "0")}`;

    const rawDateISO =
      rawStart && !isNaN(rawStart.getTime())
        ? rawStart.toISOString().slice(0, 10)
        : "";

    return {
      id: row.appointment_id,
      aptId,
      clientName: row.client_name || "Unknown Client",
      clientEmail: row.client_email || "",
      clientInitials,
      staffName: row.staff_name || "TBA",
      staffInitials,
      serviceName: row.service_name || "N/A",
      serviceId: row.service_id || null,
      categoryName: row.category_name || "",
      dateTimeStr,
      dateStr,
      timeStr,
      rawDateISO,
      rawStartAt: rawStart,
      status,
      paymentStatus,
      priceLabel: formatPrice(row.price_cents || 0),
      durationMin: Number(row.duration_min || 0),
      notes: row.appointment_notes || "",
    };
  });
}

module.exports = {
  decorateAppointmentsForView,
  decorateAdminAppointmentsForView,
};
