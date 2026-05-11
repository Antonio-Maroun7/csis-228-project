/**
 * admin-services.js
 * Client-side logic for the Admin Services page.
 * Handles search, category filter, sort, pagination, and modal open/close.
 * Depends on ALL_SERVICES and ALL_CATEGORIES globals injected by the EJS template.
 */
(function () {
  "use strict";

  /* ── Constants ─────────────────────────────────────────────── */
  var ENTRIES_PER_PAGE = 10;
  var COLORS = 8; // as-color-0 … as-color-7

  /* ── State ─────────────────────────────────────────────────── */
  var currentPage = 1;
  var filteredSvcs = ALL_SERVICES.slice();

  /* ── DOM refs ──────────────────────────────────────────────── */
  var tbody = document.getElementById("asTableBody");
  var searchInput = document.getElementById("asSearchInput");
  var categoryFilter = document.getElementById("asCategoryFilter");
  var sortSelect = document.getElementById("asSortSelect");
  var showingText = document.getElementById("asShowingText");
  var paginationEl = document.getElementById("asPagination");

  /* ── Helpers ───────────────────────────────────────────────── */
  function escHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getColorClass(index) {
    return "as-color-" + (index % COLORS);
  }

  function formatPrice(raw) {
    if (raw == null || raw === "") return "$0";
    var n = Number(raw);
    if (isNaN(n)) return "$0";
    // If stored as cents (>=1000), convert; otherwise treat as dollars
    var dollars = n >= 1000 ? n / 100 : n;
    return "$" + dollars.toFixed(dollars % 1 === 0 ? 0 : 2);
  }

  /* ── Populate category filter dropdown ──────────────────────── */
  function buildCategoryFilter() {
    var seen = {};
    ALL_CATEGORIES.forEach(function (cat) {
      if (!seen[cat.id]) {
        seen[cat.id] = true;
        var opt = document.createElement("option");
        opt.value = String(cat.id);
        opt.textContent = cat.name;
        categoryFilter.appendChild(opt);
      }
    });
  }

  /* ── Populate category dropdowns in modals ───────────────────── */
  function buildModalCategoryDropdowns() {
    var selects = [
      document.getElementById("addCategorySelect"),
      document.getElementById("editCategorySelect"),
    ];
    ALL_CATEGORIES.forEach(function (cat) {
      selects.forEach(function (sel) {
        if (!sel) return;
        var opt = document.createElement("option");
        opt.value = String(cat.id);
        opt.textContent = cat.name;
        sel.appendChild(opt);
      });
    });
  }

  /* ── Filter + sort logic ────────────────────────────────────── */
  function applyFilters() {
    var q = searchInput.value.trim().toLowerCase();
    var catId = categoryFilter.value;
    var sort = sortSelect.value;

    filteredSvcs = ALL_SERVICES.filter(function (svc) {
      var matchSearch =
        !q ||
        String(svc.name || "")
          .toLowerCase()
          .includes(q) ||
        String(svc.description || "")
          .toLowerCase()
          .includes(q);
      var matchCat = !catId || String(svc.categoryId) === catId;
      return matchSearch && matchCat;
    });

    filteredSvcs.sort(function (a, b) {
      if (sort === "name_asc") {
        return String(a.name).localeCompare(String(b.name));
      }
      if (sort === "name_desc") {
        return String(b.name).localeCompare(String(a.name));
      }
      if (sort === "price_asc") {
        return Number(a.priceRaw || 0) - Number(b.priceRaw || 0);
      }
      if (sort === "price_desc") {
        return Number(b.priceRaw || 0) - Number(a.priceRaw || 0);
      }
      if (sort === "duration_asc") {
        return Number(a.durationMin || 0) - Number(b.durationMin || 0);
      }
      return 0;
    });

    currentPage = 1;
    renderTable();
  }

  /* ── Table render ───────────────────────────────────────────── */
  function renderTable() {
    var start = (currentPage - 1) * ENTRIES_PER_PAGE;
    var end = start + ENTRIES_PER_PAGE;
    var page = filteredSvcs.slice(start, end);

    if (page.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="8" class="as-empty-cell">' +
        '<div class="admin-empty"><div class="admin-empty-icon">&#x1F9BE;</div>' +
        "<p>No services found.</p></div></td></tr>";
    } else {
      tbody.innerHTML = page
        .map(function (svc, idx) {
          var globalIdx = start + idx;
          var rowNum = globalIdx + 1;
          var colorCls = getColorClass(globalIdx);
          var icon = svc.icon || "✂";
          var name = svc.name || "Service";
          var catName = svc.categoryName || "Unknown";
          var duration = svc.durationMin ? svc.durationMin + " min" : "—";
          var price = svc.priceLabel || formatPrice(svc.priceRaw);
          var desc = svc.description || "—";
          var statusClass = svc.isActive ? "active" : "inactive";
          var statusLabel = svc.isActive ? "Active" : "Inactive";
          var nameSafe = escHtml(name).replace(/'/g, "\\'");
          var descSafe = escHtml(svc.description || "").replace(/'/g, "\\'");

          return (
            "<tr>" +
            '<td class="as-num-cell">' +
            rowNum +
            "</td>" +
            "<td>" +
            '<div class="as-svc-cell">' +
            '<div class="as-icon ' +
            colorCls +
            '">' +
            escHtml(icon) +
            "</div>" +
            "<div>" +
            '<div class="as-svc-name">' +
            escHtml(name) +
            "</div>" +
            '<div class="as-svc-id">ID: ' +
            escHtml(String(svc.id)) +
            "</div>" +
            "</div>" +
            "</div>" +
            "</td>" +
            "<td>" +
            '<span class="as-cat-badge">' +
            escHtml(catName) +
            "</span>" +
            "</td>" +
            '<td class="as-duration-cell">' +
            escHtml(duration) +
            "</td>" +
            '<td class="as-price-cell">' +
            escHtml(price) +
            "</td>" +
            '<td class="as-desc-cell" title="' +
            escHtml(svc.description || "") +
            '">' +
            escHtml(desc) +
            "</td>" +
            "<td>" +
            '<span class="admin-badge ' +
            statusClass +
            '">' +
            statusLabel +
            "</span>" +
            "</td>" +
            "<td>" +
            '<div class="as-action-cell">' +
            '<button class="as-btn-edit" onclick="openEditModal(' +
            svc.id +
            ", '" +
            nameSafe +
            "', '" +
            descSafe +
            "', " +
            svc.categoryId +
            ", " +
            svc.durationMin +
            ", " +
            (svc.priceRaw || 0) +
            ", " +
            (svc.isActive ? "true" : "false") +
            ')">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg>' +
            " Edit</button>" +
            '<button class="as-btn-del" onclick="openDeleteModal(' +
            svc.id +
            ", '" +
            nameSafe +
            "')\">" +
            '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>' +
            " Delete</button>" +
            "</div></td>" +
            "</tr>"
          );
        })
        .join("");
    }

    updateShowing();
    renderPagination();
  }

  function updateShowing() {
    var total = filteredSvcs.length;
    if (total === 0) {
      showingText.textContent = "Showing 0 to 0 of 0 services";
      return;
    }
    var start = (currentPage - 1) * ENTRIES_PER_PAGE + 1;
    var end = Math.min(currentPage * ENTRIES_PER_PAGE, total);
    showingText.textContent =
      "Showing " + start + " to " + end + " of " + total + " services";
  }

  function renderPagination() {
    var total = filteredSvcs.length;
    var pages = Math.max(1, Math.ceil(total / ENTRIES_PER_PAGE));
    var html = "";

    html +=
      '<button class="as-page-btn" onclick="asGoPage(' +
      (currentPage - 1) +
      ')"' +
      (currentPage === 1 ? " disabled" : "") +
      ">&#x2039;</button>";

    var startPage = Math.max(1, currentPage - 2);
    var endPage = Math.min(pages, startPage + 4);
    startPage = Math.max(1, endPage - 4);

    if (startPage > 1) {
      html += '<button class="as-page-btn" onclick="asGoPage(1)">1</button>';
      if (startPage > 2)
        html += '<span class="mu-page-ellipsis">&hellip;</span>';
    }

    for (var p = startPage; p <= endPage; p++) {
      html +=
        '<button class="as-page-btn' +
        (p === currentPage ? " active" : "") +
        '" onclick="asGoPage(' +
        p +
        ')">' +
        p +
        "</button>";
    }

    if (endPage < pages) {
      if (endPage < pages - 1)
        html += '<span class="mu-page-ellipsis">&hellip;</span>';
      html +=
        '<button class="as-page-btn" onclick="asGoPage(' +
        pages +
        ')">' +
        pages +
        "</button>";
    }

    html +=
      '<button class="as-page-btn" onclick="asGoPage(' +
      (currentPage + 1) +
      ')"' +
      (currentPage === pages ? " disabled" : "") +
      ">&#x203A;</button>";

    paginationEl.innerHTML = html;
  }

  /* ── Exposed page-navigation function ──────────────────────── */
  window.asGoPage = function (page) {
    var pages = Math.max(1, Math.ceil(filteredSvcs.length / ENTRIES_PER_PAGE));
    if (page < 1 || page > pages) return;
    currentPage = page;
    renderTable();
  };

  /* ── Event listeners ────────────────────────────────────────── */
  searchInput.addEventListener("input", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);
  sortSelect.addEventListener("change", applyFilters);

  /* ── Modal helpers ──────────────────────────────────────────── */
  function openOverlay(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add("open");
  }

  function closeOverlay(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove("open");
  }

  /* Open Add modal */
  document
    .getElementById("openAddModal")
    .addEventListener("click", function () {
      openOverlay("addModalOverlay");
    });

  /* Close buttons via data-close attribute */
  document.querySelectorAll("[data-close]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      closeOverlay(this.dataset.close);
    });
  });

  /* Click outside overlay to close */
  document.querySelectorAll(".as-overlay").forEach(function (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === this) closeOverlay(this.id);
    });
  });

  /* Escape key to close all overlays */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".as-overlay.open").forEach(function (overlay) {
        overlay.classList.remove("open");
      });
    }
  });

  /* ── Edit modal ─────────────────────────────────────────────── */
  window.openEditModal = function (
    id,
    name,
    description,
    categoryId,
    durationMin,
    priceRaw,
    isActive,
  ) {
    document.getElementById("editSvcName").value = name || "";
    document.getElementById("editSvcDesc").value = description || "";
    document.getElementById("editSvcDuration").value = durationMin || "";

    // Price: if stored as cents (>=1000), convert to dollars
    var priceDollars = Number(priceRaw || 0);
    if (priceDollars >= 1000) priceDollars = priceDollars / 100;
    document.getElementById("editSvcPrice").value = priceDollars;

    var statusSel = document.getElementById("editSvcStatus");
    statusSel.value = isActive ? "true" : "false";

    var catSel = document.getElementById("editCategorySelect");
    catSel.value = String(categoryId || "");

    document.getElementById("editServiceForm").action =
      "/views/admin-services/" + id + "/update";
    openOverlay("editModalOverlay");
  };

  /* ── Delete modal ───────────────────────────────────────────── */
  window.openDeleteModal = function (id, name) {
    document.getElementById("deleteSvcName").textContent =
      name || "this service";
    document.getElementById("deleteServiceForm").action =
      "/views/admin-services/" + id + "/delete";
    openOverlay("deleteModalOverlay");
  };

  /* ── Init ───────────────────────────────────────────────────── */
  buildCategoryFilter();
  buildModalCategoryDropdowns();
  applyFilters();
})();
