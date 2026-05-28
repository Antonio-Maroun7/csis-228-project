"use strict";

(function () {
  const modal = document.getElementById("scModal");
  const backdrop = document.getElementById("scModalBackdrop");
  const closeBtn = document.getElementById("scModalClose");

  const modalAvatar = document.getElementById("scModalAvatar");
  const modalName = document.getElementById("scModalName");
  const modalCode = document.getElementById("scModalCode");
  const modalEmail = document.getElementById("scModalEmail");
  const modalPhone = document.getElementById("scModalPhone");
  const modalStatus = document.getElementById("scModalStatus");
  const modalService = document.getElementById("scModalService");
  const modalLast = document.getElementById("scModalLast");
  const modalAppointments = document.getElementById("scModalAppointments");
  const modalNotes = document.getElementById("scModalNotes");

  const STATUS_LABELS = {
    active: "Active",
    follow_up: "Follow-up",
    vip: "VIP",
    inactive: "Inactive",
  };

  function openModal(btn) {
    const status = btn.dataset.status || "";
    const statusLabel =
      STATUS_LABELS[status] || btn.dataset.statusLabel || status;
    const avatarColor =
      btn.closest("tr")?.querySelector(".sc-avatar")?.style.background ||
      "#0f8f8c";
    const initials =
      btn.closest("tr")?.querySelector(".sc-avatar")?.textContent?.trim() ||
      "?";

    modalAvatar.textContent = initials;
    modalAvatar.style.background = avatarColor;
    modalName.textContent = btn.dataset.name || "—";
    modalCode.textContent = btn.dataset.code || "—";
    modalEmail.textContent = btn.dataset.email || "—";
    modalPhone.textContent = btn.dataset.phone || "—";

    // Clear existing status pill and set new one
    modalStatus.innerHTML = "";
    const pill = document.createElement("span");
    pill.className = `sc-status-pill ${status}`;
    pill.textContent = statusLabel;
    modalStatus.appendChild(pill);

    modalService.textContent = btn.dataset.service || "—";
    modalLast.textContent = btn.dataset.last || "—";
    modalAppointments.textContent =
      btn.dataset.appointments +
      " total (" +
      btn.dataset.completed +
      " completed)";
    modalNotes.textContent = btn.dataset.notes || "—";

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  // Open on View button click
  document.querySelectorAll(".sc-action-view").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openModal(btn);
    });
  });

  // Close on backdrop click or close button
  if (backdrop) backdrop.addEventListener("click", closeModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });

  // Submit filter form on Enter in search input
  const searchInput = document.getElementById("scSearchInput");
  if (searchInput) {
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("scFilterForm")?.submit();
      }
    });
  }
})();
