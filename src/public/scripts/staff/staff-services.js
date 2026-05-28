"use strict";

// ── Modal: View service detail ────────────────────────────────────
(function () {
  const modal = document.getElementById("serviceModal");
  const modalBody = document.getElementById("serviceModalBody");

  if (!modal || !modalBody) return;

  function openModal(btn) {
    const code = btn.dataset.code || "—";
    const name = btn.dataset.name || "—";
    const category = btn.dataset.category || "—";
    const duration = btn.dataset.duration || "—";
    const price = btn.dataset.price || "—";
    const status = btn.dataset.status || "—";
    const description = btn.dataset.description || "—";

    modalBody.innerHTML = `
      <div class="ss-detail-row">
        <span>Service ID</span>
        <strong>${escapeHtml(code)}</strong>
      </div>
      <div class="ss-detail-row">
        <span>Service</span>
        <strong>${escapeHtml(name)}</strong>
      </div>
      <div class="ss-detail-row">
        <span>Category</span>
        <strong>${escapeHtml(category)}</strong>
      </div>
      <div class="ss-detail-row">
        <span>Duration</span>
        <strong>${escapeHtml(duration)}</strong>
      </div>
      <div class="ss-detail-row">
        <span>Price</span>
        <strong>${escapeHtml(price)}</strong>
      </div>
      <div class="ss-detail-row">
        <span>Status</span>
        <strong>${escapeHtml(status)}</strong>
      </div>
      <div class="ss-detail-row">
        <span>Description</span>
        <strong>${escapeHtml(description || "—")}</strong>
      </div>
    `;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    modalBody.innerHTML = "";
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = String(str);
    return div.innerHTML;
  }

  // Delegate click on view buttons
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".js-view-service");
    if (btn) {
      openModal(btn);
      return;
    }
    if (e.target.closest(".js-close-modal")) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });
})();

// ── Filter form: live search on Enter ────────────────────────────
(function () {
  const input = document.getElementById("ssSearchInput");
  const form = document.getElementById("ssFilterForm");
  if (!input || !form) return;

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      form.submit();
    }
  });
})();
