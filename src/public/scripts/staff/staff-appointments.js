"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("appointmentModal");
  const modalBody = document.getElementById("appointmentModalBody");
  const viewButtons = document.querySelectorAll(".js-view-appointment");
  const closeButtons = document.querySelectorAll(".js-close-modal");

  function openModal(data) {
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
      <div class="sa-detail-row">
        <span>Appointment ID</span>
        <strong>${data.code || "—"}</strong>
      </div>

      <div class="sa-detail-row">
        <span>Client</span>
        <strong>${data.client || "—"}</strong>
      </div>

      <div class="sa-detail-row">
        <span>Email</span>
        <strong>${data.email || "—"}</strong>
      </div>

      <div class="sa-detail-row">
        <span>Service</span>
        <strong>${data.service || "—"}</strong>
      </div>

      <div class="sa-detail-row">
        <span>Category</span>
        <strong>${data.category || "—"}</strong>
      </div>

      <div class="sa-detail-row">
        <span>Date</span>
        <strong>${data.date || "—"}</strong>
      </div>

      <div class="sa-detail-row">
        <span>Time</span>
        <strong>${data.time || "—"}</strong>
      </div>

      <div class="sa-detail-row">
        <span>Duration</span>
        <strong>${data.duration || "0"} min</strong>
      </div>

      <div class="sa-detail-row">
        <span>Status</span>
        <strong>${data.status || "—"}</strong>
      </div>

      <div class="sa-detail-row">
        <span>Notes</span>
        <strong>${data.notes || "—"}</strong>
      </div>
    `;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  viewButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      openModal({
        code: button.dataset.code,
        client: button.dataset.client,
        email: button.dataset.email,
        service: button.dataset.service,
        category: button.dataset.category,
        date: button.dataset.date,
        time: button.dataset.time,
        duration: button.dataset.duration,
        status: button.dataset.status,
        notes: button.dataset.notes,
      });
    });
  });

  closeButtons.forEach(function (button) {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  // Date picker display — update visible text when native date input changes
  var dateInputEl = document.getElementById("saDateInput");
  var dateTextEl = document.getElementById("saDateText");

  if (dateInputEl && dateTextEl) {
    dateInputEl.addEventListener("change", function () {
      if (this.value) {
        var d = new Date(this.value + "T12:00:00");
        dateTextEl.textContent = d.toLocaleDateString("en-US", {
          month: "long",
          day: "2-digit",
          year: "numeric",
        });
        dateTextEl.classList.remove("sa-date-placeholder");
      } else {
        dateTextEl.textContent = "Select date";
        dateTextEl.classList.add("sa-date-placeholder");
      }
    });
  }

  // Bridge topbar search → filter form
  var topbarInput = document.getElementById("dashboardSearchInput");
  var filterInput = document.getElementById("saSearchInput");
  var filterForm = document.getElementById("saFilterForm");

  if (topbarInput && filterInput && filterForm) {
    if (filterInput.value) topbarInput.value = filterInput.value;

    topbarInput.addEventListener("input", function () {
      filterInput.value = topbarInput.value;
    });

    topbarInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        filterInput.value = topbarInput.value;
        filterForm.submit();
      }
    });
  }
});
