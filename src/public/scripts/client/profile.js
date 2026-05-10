"use strict";

(function () {
  var toggle = document.getElementById("editProfileToggle");
  var formWrap = document.getElementById("editFormWrap");
  var cancelBtn = document.getElementById("cancelEditBtn");

  if (toggle && formWrap) {
    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      formWrap.hidden = isOpen;
      toggle.textContent = isOpen ? "✎ Edit Profile" : "✕ Cancel Edit";
    });
  }

  if (cancelBtn && formWrap && toggle) {
    cancelBtn.addEventListener("click", function () {
      formWrap.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.innerHTML = '<span class="pf-edit-icon">✎</span> Edit Profile';
    });
  }

  /* Client-side password match check */
  var pwForm = document.getElementById("passwordForm");
  var newPwInput = document.getElementById("newPassword");
  var confInput = document.getElementById("confirmPassword");

  if (pwForm && newPwInput && confInput) {
    pwForm.addEventListener("submit", function (e) {
      if (newPwInput.value !== confInput.value) {
        e.preventDefault();
        alert("New passwords do not match. Please try again.");
      }
    });
  }
})();
