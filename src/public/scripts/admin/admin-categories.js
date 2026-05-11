/**
 * admin-categories.js
 * Client-side logic for the Admin Categories page.
 * Handles search, show-entries, pagination, and modal open/close.
 * Depends on ALL_CATEGORIES global injected by the EJS template.
 */
(function () {
  "use strict";

  /* ── State ─────────────────────────────────────────────────── */
  var currentPage = 1;
  var entriesPerPage = 10;
  var filteredCats = ALL_CATEGORIES.slice();

  /* ── DOM refs ──────────────────────────────────────────────── */
  var tbody = document.getElementById("acTableBody");
  var searchInput = document.getElementById("acSearchInput");
  var entriesSel = document.getElementById("acEntriesSelect");
  var showingText = document.getElementById("acShowingText");
  var paginationEl = document.getElementById("acPagination");

  /* ── Helpers ───────────────────────────────────────────────── */
  var COLORS = 8; // ac-color-0 … ac-color-7

  function getInitials(name) {
    return String(name || "?")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(function (w) {
        return w.charAt(0).toUpperCase();
      })
      .join("");
  }

  function getColorClass(index) {
    return "ac-color-" + (index % COLORS);
  }

  function escHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ── Table render ──────────────────────────────────────────── */
  function renderTable() {
    var start = (currentPage - 1) * entriesPerPage;
    var end = start + entriesPerPage;
    var page = filteredCats.slice(start, end);

    if (page.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6" class="ac-empty-cell">' +
        '<div class="admin-empty"><div class="admin-empty-icon">&#x25A6;</div>' +
        "<p>No categories found.</p></div></td></tr>";
    } else {
      tbody.innerHTML = page
        .map(function (cat, idx) {
          var globalIdx = start + idx;
          var rowNum = globalIdx + 1;
          var initials = getInitials(cat.name);
          var colorCls = getColorClass(globalIdx);
          var desc = cat.description || "No description";
          var statusClass = cat.isActive ? "active" : "inactive";
          var statusLabel = cat.isActive ? "Active" : "Inactive";
          var svcCount =
            typeof cat.servicesCount === "number" ? cat.servicesCount : 0;
          var nameSafe = escHtml(cat.name || "Category").replace(/'/g, "\\'");

          return (
            "<tr>" +
            '<td class="ac-num-cell">' +
            rowNum +
            "</td>" +
            "<td>" +
            '<div class="ac-cat-cell">' +
            '<div class="ac-avatar ' +
            colorCls +
            '">' +
            escHtml(initials) +
            "</div>" +
            "<div>" +
            '<div class="ac-cat-name">' +
            escHtml(cat.name || "Category") +
            "</div>" +
            '<div class="ac-cat-id">ID: ' +
            escHtml(String(cat.id)) +
            "</div>" +
            "</div>" +
            "</div>" +
            "</td>" +
            '<td class="ac-desc-cell">' +
            escHtml(desc) +
            "</td>" +
            "<td>" +
            '<span class="ac-svc-badge">' +
            svcCount +
            "</span>" +
            "</td>" +
            '<td><span class="admin-badge ' +
            statusClass +
            '">' +
            statusLabel +
            "</span></td>" +
            "<td>" +
            '<div class="ac-action-cell">' +
            '<button class="ac-btn-edit" onclick="openEditModal(' +
            cat.id +
            ", '" +
            nameSafe +
            "', '" +
            escHtml(cat.description || "").replace(/'/g, "\\'") +
            "', " +
            (cat.isActive ? "true" : "false") +
            ')">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg>' +
            " Edit</button>" +
            '<button class="ac-btn-del" onclick="openDeleteModal(' +
            cat.id +
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
    var total = filteredCats.length;
    if (total === 0) {
      showingText.textContent = "Showing 0 to 0 of 0 entries";
      return;
    }
    var start = (currentPage - 1) * entriesPerPage + 1;
    var end = Math.min(currentPage * entriesPerPage, total);
    showingText.textContent =
      "Showing " + start + " to " + end + " of " + total + " entries";
  }

  function renderPagination() {
    var total = filteredCats.length;
    var pages = Math.max(1, Math.ceil(total / entriesPerPage));
    var html = "";

    html +=
      '<button class="ac-page-btn" onclick="acGoPage(' +
      (currentPage - 1) +
      ')"' +
      (currentPage === 1 ? " disabled" : "") +
      ">&#x2039;</button>";

    var startPage = Math.max(1, currentPage - 2);
    var endPage = Math.min(pages, startPage + 4);
    startPage = Math.max(1, endPage - 4);

    if (startPage > 1) {
      html += '<button class="ac-page-btn" onclick="acGoPage(1)">1</button>';
      if (startPage > 2)
        html += '<span class="mu-page-ellipsis">&hellip;</span>';
    }

    for (var p = startPage; p <= endPage; p++) {
      html +=
        '<button class="ac-page-btn' +
        (p === currentPage ? " active" : "") +
        '" onclick="acGoPage(' +
        p +
        ')">' +
        p +
        "</button>";
    }

    if (endPage < pages) {
      if (endPage < pages - 1)
        html += '<span class="mu-page-ellipsis">&hellip;</span>';
      html +=
        '<button class="ac-page-btn" onclick="acGoPage(' +
        pages +
        ')">' +
        pages +
        "</button>";
    }

    html +=
      '<button class="ac-page-btn" onclick="acGoPage(' +
      (currentPage + 1) +
      ')"' +
      (currentPage === pages ? " disabled" : "") +
      ">&#x203A;</button>";

    paginationEl.innerHTML = html;
  }

  /* ── Exposed page-navigation function ──────────────────────── */
  window.acGoPage = function (page) {
    var pages = Math.max(1, Math.ceil(filteredCats.length / entriesPerPage));
    if (page < 1 || page > pages) return;
    currentPage = page;
    renderTable();
  };

  /* ── Search ────────────────────────────────────────────────── */
  searchInput.addEventListener("input", function () {
    var q = this.value.trim().toLowerCase();
    filteredCats = q
      ? ALL_CATEGORIES.filter(function (cat) {
          return (
            String(cat.name || "")
              .toLowerCase()
              .includes(q) ||
            String(cat.description || "")
              .toLowerCase()
              .includes(q)
          );
        })
      : ALL_CATEGORIES.slice();
    currentPage = 1;
    renderTable();
  });

  /* ── Entries per page ──────────────────────────────────────── */
  entriesSel.addEventListener("change", function () {
    entriesPerPage = parseInt(this.value, 10) || 10;
    currentPage = 1;
    renderTable();
  });

  /* ── Modal helpers ─────────────────────────────────────────── */
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
  document.querySelectorAll(".ac-overlay").forEach(function (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === this) closeOverlay(this.id);
    });
  });

  /* Escape key to close all overlays */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".ac-overlay.open").forEach(function (overlay) {
        overlay.classList.remove("open");
      });
    }
  });

  /* ── Edit modal ────────────────────────────────────────────── */
  window.openEditModal = function (id, name, description, isActive) {
    document.getElementById("editCatName").value = name || "";
    document.getElementById("editCatDesc").value = description || "";
    var statusSel = document.getElementById("editCatStatus");
    statusSel.value = isActive ? "true" : "false";
    document.getElementById("editCategoryForm").action =
      "/views/admin-categories/" + id + "/update";
    openOverlay("editModalOverlay");
  };

  /* ── Delete modal ──────────────────────────────────────────── */
  window.openDeleteModal = function (id, name) {
    document.getElementById("deleteCatName").textContent =
      name || "this category";
    document.getElementById("deleteCategoryForm").action =
      "/views/admin-categories/" + id + "/delete";
    openOverlay("deleteModalOverlay");
  };

  /* ── Init ──────────────────────────────────────────────────── */
  renderTable();
})();
