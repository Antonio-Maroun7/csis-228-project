/* global AA_APPOINTMENTS, AA_STAFF_LIST */
(function () {
  "use strict";

  /* ── Constants ─────────────────────────────────────────────────── */
  var PAGE_SIZE = 7;
  var currentPage = 1;
  var filtered = [];

  /* ── Avatar colour helper ───────────────────────────────────────── */
  function avatarClass(name) {
    if (!name) return "aa-av-default";
    var ch = name.trim().charAt(0).toLowerCase();
    if (ch >= "a" && ch <= "z") return "aa-av-" + ch;
    return "aa-av-default";
  }

  /* ── Badge helpers ──────────────────────────────────────────────── */
  var STATUS_CLASS = {
    confirmed: "aa-badge aa-badge-confirmed",
    pending: "aa-badge aa-badge-pending",
    completed: "aa-badge aa-badge-completed",
    cancelled: "aa-badge aa-badge-cancelled",
    no_show: "aa-badge aa-badge-no_show",
  };

  var PAYMENT_CLASS = {
    paid: "aa-badge aa-pay-paid",
    unpaid: "aa-badge aa-pay-unpaid",
    refunded: "aa-badge aa-pay-refunded",
  };

  function statusBadge(status) {
    var cls = STATUS_CLASS[status] || "aa-badge";
    var label = status ? status.replace("_", " ") : "—";
    return '<span class="' + cls + '">' + esc(label) + "</span>";
  }

  function paymentBadge(pay) {
    var cls = PAYMENT_CLASS[pay] || "aa-badge";
    return '<span class="' + cls + '">' + esc(pay || "—") + "</span>";
  }

  /* ── HTML escape ────────────────────────────────────────────────── */
  function esc(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ── Action forms for status transitions ───────────────────────── */
  var TRANSITIONS = {
    pending: [
      { status: "confirmed", label: "Confirm", cls: "aa-action-confirm" },
      { status: "cancelled", label: "Cancel", cls: "aa-action-cancel" },
    ],
    confirmed: [
      { status: "completed", label: "Complete", cls: "aa-action-complete" },
      { status: "cancelled", label: "Cancel", cls: "aa-action-cancel" },
    ],
    completed: [],
    cancelled: [],
    no_show: [],
  };

  function buildActionForms(apt) {
    var transitions = TRANSITIONS[apt.status] || [];
    if (transitions.length === 0) {
      return '<span style="color:#94a3b8;font-size:0.75rem">—</span>';
    }
    return transitions
      .map(function (t) {
        return (
          '<form method="POST" action="/views/admin-appointments/' +
          apt.id +
          '/update-status" style="display:inline;margin:0 2px 0 0">' +
          '<input type="hidden" name="status" value="' +
          t.status +
          '">' +
          '<button type="submit" class="aa-action-btn ' +
          t.cls +
          '">' +
          t.label +
          "</button>" +
          "</form>"
        );
      })
      .join("");
  }
  function buildRow(apt) {
    var clientAv = avatarClass(apt.clientInitials || apt.clientName);
    var staffAv = avatarClass(apt.staffInitials || apt.staffName);

    return (
      "<tr>" +
      // Apt ID
      '<td><span class="aa-apt-id">' +
      esc(apt.aptId) +
      "</span></td>" +
      // Customer
      '<td><div class="aa-person-cell">' +
      '<div class="aa-avatar ' +
      clientAv +
      '">' +
      esc(apt.clientInitials || "?") +
      "</div>" +
      "<div>" +
      '<div class="aa-person-name">' +
      esc(apt.clientName) +
      "</div>" +
      '<div class="aa-person-email">' +
      esc(apt.clientEmail) +
      "</div>" +
      "</div>" +
      "</div></td>" +
      // Service
      '<td><div class="aa-svc-name">' +
      esc(apt.serviceName) +
      "</div>" +
      '<div class="aa-svc-cat">' +
      esc(apt.categoryName) +
      "</div></td>" +
      // Staff
      '<td><div class="aa-person-cell">' +
      '<div class="aa-avatar ' +
      staffAv +
      '">' +
      esc(apt.staffInitials || "?") +
      "</div>" +
      '<div class="aa-person-name">' +
      esc(apt.staffName) +
      "</div>" +
      "</div></td>" +
      // Date & Time
      '<td><div class="aa-date-line">' +
      esc(apt.dateStr) +
      "</div>" +
      '<div class="aa-time-line">' +
      esc(apt.timeStr) +
      "</div></td>" +
      // Status
      "<td>" +
      statusBadge(apt.status) +
      "</td>" +
      // Payment
      "<td>" +
      paymentBadge(apt.paymentStatus) +
      "</td>" +
      // Actions
      '<td class="aa-actions-cell">' +
      '<button class="aa-btn-icon aa-view-btn" data-id="' +
      apt.id +
      '" title="View Details" type="button">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">' +
      '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>' +
      "</svg>" +
      "</button>" +
      buildActionForms(apt) +
      "</td>" +
      "</tr>"
    );
  }

  /* ── Render table page ──────────────────────────────────────────── */
  function render() {
    var tbody = document.getElementById("aaTableBody");
    if (!tbody) return;

    var total = filtered.length;
    var totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    currentPage = Math.min(currentPage, totalPages);

    var start = (currentPage - 1) * PAGE_SIZE;
    var end = Math.min(start + PAGE_SIZE, total);
    var page = filtered.slice(start, end);

    if (page.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="8"><div class="aa-empty">' +
        '<div class="aa-empty-icon">📅</div>' +
        "<p>No appointments found matching the current filters.</p>" +
        "</div></td></tr>";
    } else {
      tbody.innerHTML = page.map(buildRow).join("");
      // bind view buttons
      tbody.querySelectorAll(".aa-view-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          openDetail(Number(btn.getAttribute("data-id")));
        });
      });
    }

    // Pagination info
    var info = document.getElementById("aaPagInfo");
    if (info) {
      info.textContent =
        total === 0
          ? "No entries"
          : "Showing " +
            (start + 1) +
            " to " +
            end +
            " of " +
            total +
            " entries";
    }

    renderPagination(totalPages);
  }

  /* ── Pagination buttons ─────────────────────────────────────────── */
  function renderPagination(totalPages) {
    var container = document.getElementById("aaPagBtns");
    if (!container) return;
    container.innerHTML = "";

    function btn(label, page, disabled, active) {
      var b = document.createElement("button");
      b.className = "aa-page-btn" + (active ? " active" : "");
      b.textContent = label;
      b.disabled = disabled;
      if (!disabled && !active) {
        b.addEventListener("click", function () {
          currentPage = page;
          render();
        });
      }
      return b;
    }

    container.appendChild(btn("<", currentPage - 1, currentPage === 1, false));

    var pages = paginationRange(currentPage, totalPages);
    pages.forEach(function (p) {
      if (p === "...") {
        var span = document.createElement("span");
        span.className = "aa-page-btn";
        span.style.cursor = "default";
        span.textContent = "…";
        container.appendChild(span);
      } else {
        container.appendChild(btn(p, p, false, p === currentPage));
      }
    });

    container.appendChild(
      btn(">", currentPage + 1, currentPage === totalPages, false),
    );
  }

  function paginationRange(current, total) {
    if (total <= 7) {
      var arr = [];
      for (var i = 1; i <= total; i++) arr.push(i);
      return arr;
    }
    var range = [1];
    if (current > 3) range.push("...");
    for (
      var j = Math.max(2, current - 1);
      j <= Math.min(total - 1, current + 1);
      j++
    ) {
      range.push(j);
    }
    if (current < total - 2) range.push("...");
    range.push(total);
    return range;
  }

  /* ── Filter logic ───────────────────────────────────────────────── */
  function applyFilters() {
    var statusVal =
      (document.getElementById("aaFilterStatus") || {}).value || "";
    var payVal = (document.getElementById("aaFilterPayment") || {}).value || "";
    var serviceVal =
      (document.getElementById("aaFilterService") || {}).value || "";
    var staffVal = (document.getElementById("aaFilterStaff") || {}).value || "";
    var dateFrom =
      (document.getElementById("aaFilterDateFrom") || {}).value || "";
    var dateTo = (document.getElementById("aaFilterDateTo") || {}).value || "";

    filtered = (AA_APPOINTMENTS || []).filter(function (apt) {
      if (statusVal && apt.status !== statusVal) return false;
      if (payVal && apt.paymentStatus !== payVal) return false;
      if (serviceVal && String(apt.serviceId) !== String(serviceVal))
        return false;
      if (staffVal) {
        // match by staff id via staff list or by name
        var staffEntry = (AA_STAFF_LIST || []).find(function (s) {
          return String(s.id) === String(staffVal);
        });
        if (staffEntry && apt.staffName !== staffEntry.fullname) return false;
      }
      if (dateFrom && apt.rawDateISO && apt.rawDateISO < dateFrom) return false;
      if (dateTo && apt.rawDateISO && apt.rawDateISO > dateTo) return false;
      return true;
    });

    currentPage = 1;
    render();
  }

  function resetFilters() {
    [
      "aaFilterStatus",
      "aaFilterPayment",
      "aaFilterService",
      "aaFilterStaff",
      "aaFilterDateFrom",
      "aaFilterDateTo",
    ].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = "";
    });
    applyFilters();
  }

  /* ── Detail modal ───────────────────────────────────────────────── */
  function openDetail(id) {
    var apt = (AA_APPOINTMENTS || []).find(function (a) {
      return a.id === id;
    });
    if (!apt) return;

    var body = document.getElementById("aaModalBody");
    if (!body) return;

    function row(label, value) {
      return (
        '<div class="aa-detail-row">' +
        '<span class="aa-detail-label">' +
        esc(label) +
        "</span>" +
        '<span class="aa-detail-value">' +
        value +
        "</span>" +
        "</div>"
      );
    }

    body.innerHTML =
      row(
        "Appointment ID",
        '<span class="aa-apt-id">' + esc(apt.aptId) + "</span>",
      ) +
      row(
        "Customer",
        esc(apt.clientName) +
          (apt.clientEmail
            ? '<br><span style="color:#64748b;font-size:0.78rem">' +
              esc(apt.clientEmail) +
              "</span>"
            : ""),
      ) +
      row(
        "Service",
        esc(apt.serviceName) +
          (apt.categoryName
            ? '<br><span style="color:#64748b;font-size:0.78rem">' +
              esc(apt.categoryName) +
              "</span>"
            : ""),
      ) +
      row("Staff", esc(apt.staffName)) +
      row("Date", esc(apt.dateStr)) +
      row("Time", esc(apt.timeStr)) +
      row("Status", statusBadge(apt.status)) +
      row("Payment", paymentBadge(apt.paymentStatus)) +
      row("Price", esc(apt.priceLabel)) +
      row("Duration", apt.durationMin ? apt.durationMin + " min" : "—") +
      (apt.notes ? row("Notes", esc(apt.notes)) : "");

    var modal = document.getElementById("aaDetailModal");
    if (modal) modal.classList.add("open");
  }

  function closeModal() {
    var modal = document.getElementById("aaDetailModal");
    if (modal) modal.classList.remove("open");
  }

  /* ── Init ───────────────────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", function () {
    // initial render
    filtered = Array.isArray(AA_APPOINTMENTS) ? AA_APPOINTMENTS.slice() : [];
    render();

    // filter buttons
    var applyBtn = document.getElementById("aaApplyFilters");
    var resetBtn = document.getElementById("aaResetFilters");
    if (applyBtn) applyBtn.addEventListener("click", applyFilters);
    if (resetBtn) resetBtn.addEventListener("click", resetFilters);

    // modal close
    var closeBtn = document.getElementById("aaModalCloseBtn");
    var overlay = document.getElementById("aaDetailModal");
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (overlay) {
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) closeModal();
      });
    }

    // ESC key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  });
})();
