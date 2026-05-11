/**
 * manage-users.js
 * Client-side logic for the Manage Users admin page.
 * Handles search, show-entries, pagination, and modal open/close.
 * Depends on ALL_USERS global injected by the EJS template.
 */
(function () {
  "use strict";

  /* ── State ─────────────────────────────────────────────────── */
  let currentPage = 1;
  let entriesPerPage = 10;
  let filteredUsers = ALL_USERS.slice();

  /* ── DOM refs ──────────────────────────────────────────────── */
  const tbody = document.getElementById("muTableBody");
  const searchInput = document.getElementById("muSearchInput");
  const entriesSel = document.getElementById("muEntriesSelect");
  const showingText = document.getElementById("muShowingText");
  const paginationEl = document.getElementById("muPagination");

  /* ── Helpers ───────────────────────────────────────────────── */
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

  function escHtml(str) {
    return String(str)
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
    var page = filteredUsers.slice(start, end);

    if (page.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="7" class="mu-empty-cell">' +
        '<div class="admin-empty"><div class="admin-empty-icon">👥</div>' +
        "<p>No users found.</p></div></td></tr>";
    } else {
      tbody.innerHTML = page
        .map(function (u, idx) {
          var rowNum = start + idx + 1;
          var initials = getInitials(u.fullname);
          var roleClass =
            u.role === "admin"
              ? "admin"
              : u.role === "staff"
                ? "staff"
                : "client";
          var statusClass = u.is_active ? "active" : "inactive";
          var statusLabel = u.is_active ? "Active" : "Inactive";

          return (
            "<tr>" +
            '<td class="mu-num-cell">' +
            rowNum +
            "</td>" +
            "<td>" +
            '<div class="admin-client-cell">' +
            '<div class="admin-avatar">' +
            escHtml(initials) +
            "</div>" +
            '<div class="admin-client-name">' +
            escHtml(u.fullname || "Unknown") +
            "</div>" +
            "</div></td>" +
            '<td class="mu-muted-cell">' +
            escHtml(u.email || "—") +
            "</td>" +
            '<td class="mu-muted-cell">' +
            escHtml(u.phone || "—") +
            "</td>" +
            '<td><span class="admin-badge ' +
            roleClass +
            '">' +
            escHtml(u.role || "client") +
            "</span></td>" +
            '<td><span class="admin-badge ' +
            statusClass +
            '">' +
            statusLabel +
            "</span></td>" +
            "<td>" +
            '<div class="mu-action-cell">' +
            '<button class="mu-btn-edit" onclick="openEditModal(' +
            u.id +
            ')">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg>' +
            " Edit</button>" +
            '<button class="mu-btn-del" onclick="openDeleteModal(' +
            u.id +
            ", '" +
            escHtml(u.fullname || "this user").replace(/'/g, "\\'") +
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
    var total = filteredUsers.length;
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
    var total = filteredUsers.length;
    var pages = Math.max(1, Math.ceil(total / entriesPerPage));
    var html = "";

    html +=
      '<button class="mu-page-btn" onclick="muGoPage(' +
      (currentPage - 1) +
      ')"' +
      (currentPage === 1 ? " disabled" : "") +
      ">‹</button>";

    // Show at most 5 page buttons with ellipsis
    var startPage = Math.max(1, currentPage - 2);
    var endPage = Math.min(pages, startPage + 4);
    startPage = Math.max(1, endPage - 4);

    if (startPage > 1) {
      html += '<button class="mu-page-btn" onclick="muGoPage(1)">1</button>';
      if (startPage > 2) html += '<span class="mu-page-ellipsis">…</span>';
    }

    for (var i = startPage; i <= endPage; i++) {
      html +=
        '<button class="mu-page-btn' +
        (i === currentPage ? " active" : "") +
        '" onclick="muGoPage(' +
        i +
        ')">' +
        i +
        "</button>";
    }

    if (endPage < pages) {
      if (endPage < pages - 1)
        html += '<span class="mu-page-ellipsis">…</span>';
      html +=
        '<button class="mu-page-btn" onclick="muGoPage(' +
        pages +
        ')">' +
        pages +
        "</button>";
    }

    html +=
      '<button class="mu-page-btn" onclick="muGoPage(' +
      (currentPage + 1) +
      ')"' +
      (currentPage === pages ? " disabled" : "") +
      ">›</button>";

    paginationEl.innerHTML = html;
  }

  window.muGoPage = function (page) {
    var pages = Math.max(1, Math.ceil(filteredUsers.length / entriesPerPage));
    if (page < 1 || page > pages) return;
    currentPage = page;
    renderTable();
  };

  /* ── Search ─────────────────────────────────────────────────── */
  searchInput.addEventListener("input", function () {
    var q = this.value.toLowerCase().trim();
    filteredUsers = q
      ? ALL_USERS.filter(function (u) {
          return (
            (u.fullname || "").toLowerCase().includes(q) ||
            (u.email || "").toLowerCase().includes(q) ||
            (u.phone || "").toLowerCase().includes(q)
          );
        })
      : ALL_USERS.slice();
    currentPage = 1;
    renderTable();
  });

  /* ── Show entries ───────────────────────────────────────────── */
  entriesSel.addEventListener("change", function () {
    entriesPerPage = parseInt(this.value, 10);
    currentPage = 1;
    renderTable();
  });

  /* ── Modal helpers ──────────────────────────────────────────── */
  function openOverlay(id) {
    document.getElementById(id).classList.add("open");
  }
  function closeOverlay(id) {
    document.getElementById(id).classList.remove("open");
  }

  // Close when clicking the backdrop
  ["addModalOverlay", "editModalOverlay", "deleteModalOverlay"].forEach(
    function (id) {
      var el = document.getElementById(id);
      el.addEventListener("click", function (e) {
        if (e.target === el) closeOverlay(id);
      });
    },
  );

  // Wire all [data-close] buttons
  document.querySelectorAll("[data-close]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      closeOverlay(btn.getAttribute("data-close"));
    });
  });

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      ["addModalOverlay", "editModalOverlay", "deleteModalOverlay"].forEach(
        closeOverlay,
      );
    }
  });

  /* ── Add Modal ──────────────────────────────────────────────── */
  document
    .getElementById("openAddModal")
    .addEventListener("click", function () {
      openOverlay("addModalOverlay");
    });

  /* ── Edit Modal ─────────────────────────────────────────────── */
  var editForm = document.getElementById("editUserForm");

  window.openEditModal = function (userId) {
    var u = ALL_USERS.find(function (x) {
      return x.id === userId;
    });
    if (!u) return;
    document.getElementById("editFullname").value = u.fullname || "";
    document.getElementById("editEmail").value = u.email || "";
    document.getElementById("editPhone").value = u.phone || "";
    document.getElementById("editRole").value = u.role || "client";
    document.getElementById("editStatus").value = u.is_active
      ? "true"
      : "false";
    editForm.action = "/views/manage-users/" + userId + "/update";
    openOverlay("editModalOverlay");
  };

  /* ── Delete Modal ───────────────────────────────────────────── */
  var deleteForm = document.getElementById("deleteUserForm");

  window.openDeleteModal = function (userId, userName) {
    document.getElementById("deleteUserName").textContent = userName;
    deleteForm.action = "/views/manage-users/" + userId + "/delete";
    openOverlay("deleteModalOverlay");
  };

  /* ── Initial render ─────────────────────────────────────────── */
  renderTable();
})();
