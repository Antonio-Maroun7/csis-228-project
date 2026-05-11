/* admin-staff-services.js — client-side logic for Staff Services admin page */
(function () {
  "use strict";

  var PAGE_SIZE = 5;
  var currentPage = 1;
  var isEditMode = false;
  var pendingDeleteStaffId = null;
  var pendingDeleteServiceId = null;

  /* ── DOM refs ────────────────────────────────────────────────────── */
  var tableBody = document.getElementById("ssTableBody");
  var emptyEl = document.getElementById("ssEmpty");
  var showingEl = document.getElementById("ssShowing");
  var paginationEl = document.getElementById("ssPagination");

  var assignForm = document.getElementById("ssAssignForm");
  var formTitle = document.getElementById("ssFormTitle");
  var staffSelect = document.getElementById("ssStaffSelect");
  var serviceSelect = document.getElementById("ssServiceSelect");
  var durationInput = document.getElementById("ssDurationInput");
  var priceInput = document.getElementById("ssPriceInput");
  var statusSelect = document.getElementById("ssStatusSelect");
  var saveBtnText = document.getElementById("ssSaveBtnText");
  var clearBtn = document.getElementById("ssClearBtn");
  var editStaffIdInput = document.getElementById("ssEditStaffId");
  var editServiceIdInput = document.getElementById("ssEditServiceId");

  var deleteModal = document.getElementById("ssDeleteModal");
  var deleteModalBody = document.getElementById("ssDeleteModalBody");
  var deleteConfirmBtn = document.getElementById("ssDeleteConfirm");
  var deleteCancelBtn = document.getElementById("ssDeleteCancel");
  var deleteForm = document.getElementById("ssDeleteForm");

  /* ── Populate dropdowns ──────────────────────────────────────────── */
  function populateDropdowns() {
    var staffUsers = window.ALL_STAFF_USERS || [];
    var services = window.ALL_SERVICES || [];

    staffUsers.forEach(function (u) {
      var opt = document.createElement("option");
      opt.value = u.id;
      opt.textContent = u.name;
      staffSelect.appendChild(opt);
    });

    services.forEach(function (s) {
      var opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent =
        s.name + (s.categoryName ? " (" + s.categoryName + ")" : "");
      serviceSelect.appendChild(opt);
    });
  }

  /* ── Avatar helpers ──────────────────────────────────────────────── */
  var COLORS = [
    "ss-color-0",
    "ss-color-1",
    "ss-color-2",
    "ss-color-3",
    "ss-color-4",
    "ss-color-5",
    "ss-color-6",
    "ss-color-7",
  ];

  function colorClass(staffId) {
    return COLORS[Math.abs(Number(staffId) || 0) % COLORS.length];
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ── Render table page ───────────────────────────────────────────── */
  function renderPage(page) {
    var data = window.ALL_STAFF_SERVICES || [];
    var total = data.length;
    var totalPages = Math.ceil(total / PAGE_SIZE) || 1;
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    currentPage = page;

    var start = (page - 1) * PAGE_SIZE;
    var end = Math.min(start + PAGE_SIZE, total);
    var slice = data.slice(start, end);

    if (total === 0) {
      tableBody.innerHTML = "";
      emptyEl.style.display = "";
      showingEl.textContent = "Showing 0 to 0 of 0 entries";
      paginationEl.innerHTML = "";
      return;
    }

    emptyEl.style.display = "none";
    showingEl.textContent =
      "Showing " + (start + 1) + " to " + end + " of " + total + " entries";

    var rows = slice
      .map(function (ss) {
        var col = colorClass(ss.staffId);
        var initials = escapeHtml(ss.staffInitials || "?");
        var staffName = escapeHtml(ss.staffName || "Staff");
        var serviceName = escapeHtml(ss.serviceName || "—");
        var categoryName = escapeHtml(ss.categoryName || "—");
        var duration = ss.durationMin ? ss.durationMin + " min" : "—";
        var price = ss.priceLabel || "—";
        var badge = ss.isActive
          ? '<span class="ss-badge ss-badge-active">Active</span>'
          : '<span class="ss-badge ss-badge-inactive">Inactive</span>';

        var editData =
          'data-staff-id="' +
          ss.staffId +
          '" ' +
          'data-service-id="' +
          ss.serviceId +
          '" ' +
          'data-duration="' +
          (ss.durationMin || "") +
          '" ' +
          'data-price="' +
          (ss.priceRaw || "") +
          '" ' +
          'data-is-active="' +
          (ss.isActive ? "true" : "false") +
          '"';

        return (
          "<tr>" +
          "<td>" +
          '<div class="ss-staff-cell">' +
          '<div class="ss-avatar ' +
          col +
          '">' +
          initials +
          "</div>" +
          '<span class="ss-staff-name">' +
          staffName +
          "</span>" +
          "</div>" +
          "</td>" +
          "<td>" +
          serviceName +
          "</td>" +
          "<td>" +
          categoryName +
          "</td>" +
          "<td>" +
          duration +
          "</td>" +
          "<td>" +
          price +
          "</td>" +
          "<td>" +
          badge +
          "</td>" +
          "<td>" +
          '<div class="ss-actions">' +
          '<button type="button" class="ss-btn-icon ss-btn-edit" title="Edit" ' +
          editData +
          ' onclick="ssOpenEdit(this)">✏️</button>' +
          '<button type="button" class="ss-btn-icon ss-btn-delete" title="Remove" ' +
          'data-staff-id="' +
          ss.staffId +
          '" ' +
          'data-service-id="' +
          ss.serviceId +
          '" ' +
          'data-staff-name="' +
          staffName +
          '" ' +
          'data-service-name="' +
          serviceName +
          '" ' +
          'onclick="ssOpenDelete(this)">🗑️</button>' +
          "</div>" +
          "</td>" +
          "</tr>"
        );
      })
      .join("");

    tableBody.innerHTML = rows;
    renderPagination(page, totalPages);
  }

  /* ── Pagination buttons ──────────────────────────────────────────── */
  function renderPagination(current, total) {
    if (total <= 1) {
      paginationEl.innerHTML = "";
      return;
    }

    var html = "";

    // Prev button
    html +=
      '<button class="ss-page-btn" ' +
      (current <= 1 ? "disabled" : "") +
      ' onclick="ssGoPage(' +
      (current - 1) +
      ')">&#x2039;</button>';

    // Page buttons (smart range)
    var pages = buildPageRange(current, total);
    pages.forEach(function (p) {
      if (p === "...") {
        html += '<button class="ss-page-btn" disabled>…</button>';
      } else {
        html +=
          '<button class="ss-page-btn' +
          (p === current ? " active" : "") +
          '" ' +
          'onclick="ssGoPage(' +
          p +
          ')">' +
          p +
          "</button>";
      }
    });

    // Next button
    html +=
      '<button class="ss-page-btn" ' +
      (current >= total ? "disabled" : "") +
      ' onclick="ssGoPage(' +
      (current + 1) +
      ')">&#x203A;</button>';

    paginationEl.innerHTML = html;
  }

  function buildPageRange(current, total) {
    if (total <= 5) {
      var arr = [];
      for (var i = 1; i <= total; i++) arr.push(i);
      return arr;
    }
    var pages = [1];
    if (current > 3) pages.push("...");
    for (
      var p = Math.max(2, current - 1);
      p <= Math.min(total - 1, current + 1);
      p++
    ) {
      pages.push(p);
    }
    if (current < total - 2) pages.push("...");
    pages.push(total);
    return pages;
  }

  /* ── Global: navigate page ───────────────────────────────────────── */
  window.ssGoPage = function (page) {
    renderPage(page);
  };

  /* ── Global: open edit ───────────────────────────────────────────── */
  window.ssOpenEdit = function (btn) {
    var staffId = btn.getAttribute("data-staff-id");
    var serviceId = btn.getAttribute("data-service-id");
    var duration = btn.getAttribute("data-duration");
    var price = btn.getAttribute("data-price");
    var isActive = btn.getAttribute("data-is-active") === "true";

    isEditMode = true;

    // Update form title
    formTitle.textContent = "Edit Assignment";

    // Set hidden fields
    editStaffIdInput.value = staffId;
    editServiceIdInput.value = serviceId;

    // Pre-fill dropdowns (disable to prevent changing the assignment key)
    staffSelect.value = staffId;
    staffSelect.disabled = true;
    serviceSelect.value = serviceId;
    serviceSelect.disabled = true;

    // Pre-fill overrides
    durationInput.value = duration || "";
    priceInput.value = price
      ? Number(price) >= 1000
        ? (Number(price) / 100).toFixed(2)
        : Number(price).toFixed(2)
      : "";
    statusSelect.value = isActive ? "true" : "false";

    // Change form action
    assignForm.action =
      "/views/admin-staff-services/" + staffId + "/" + serviceId + "/update";

    // Remove required attrs from dropdowns so HTML5 validation doesn't block
    staffSelect.removeAttribute("required");
    serviceSelect.removeAttribute("required");

    // Update save button text
    saveBtnText.textContent = "Update Assignment";

    // Scroll form into view on mobile
    assignForm.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  /* ── Global: open delete modal ───────────────────────────────────── */
  window.ssOpenDelete = function (btn) {
    pendingDeleteStaffId = btn.getAttribute("data-staff-id");
    pendingDeleteServiceId = btn.getAttribute("data-service-id");
    var staffName = btn.getAttribute("data-staff-name") || "this staff member";
    var serviceName = btn.getAttribute("data-service-name") || "this service";

    deleteModalBody.innerHTML =
      "Remove <strong>" +
      escapeHtml(serviceName) +
      "</strong> from <strong>" +
      escapeHtml(staffName) +
      "</strong>? This action cannot be undone.";

    deleteModal.classList.add("open");
  };

  /* ── Clear / reset form ──────────────────────────────────────────── */
  function resetForm() {
    isEditMode = false;
    formTitle.textContent = "Assign Staff to Service";

    assignForm.action = "/views/admin-staff-services/assign";
    assignForm.reset();

    staffSelect.value = "";
    staffSelect.disabled = false;
    staffSelect.setAttribute("required", "required");

    serviceSelect.value = "";
    serviceSelect.disabled = false;
    serviceSelect.setAttribute("required", "required");

    durationInput.value = "";
    priceInput.value = "";
    statusSelect.value = "true";

    editStaffIdInput.value = "";
    editServiceIdInput.value = "";

    saveBtnText.textContent = "Save Assignment";
  }

  /* ── Clear button ────────────────────────────────────────────────── */
  if (clearBtn) {
    clearBtn.addEventListener("click", resetForm);
  }

  /* ── Delete modal confirm/cancel ─────────────────────────────────── */
  if (deleteConfirmBtn) {
    deleteConfirmBtn.addEventListener("click", function () {
      if (!pendingDeleteStaffId || !pendingDeleteServiceId) return;
      deleteForm.action =
        "/views/admin-staff-services/" +
        pendingDeleteStaffId +
        "/" +
        pendingDeleteServiceId +
        "/delete";
      deleteModal.classList.remove("open");
      deleteForm.submit();
    });
  }

  if (deleteCancelBtn) {
    deleteCancelBtn.addEventListener("click", function () {
      deleteModal.classList.remove("open");
      pendingDeleteStaffId = null;
      pendingDeleteServiceId = null;
    });
  }

  // Close modal on overlay click
  if (deleteModal) {
    deleteModal.addEventListener("click", function (e) {
      if (e.target === deleteModal) {
        deleteModal.classList.remove("open");
        pendingDeleteStaffId = null;
        pendingDeleteServiceId = null;
      }
    });
  }

  /* ── Init ────────────────────────────────────────────────────────── */
  populateDropdowns();
  renderPage(1);
})();
