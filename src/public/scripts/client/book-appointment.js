"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var staffSelect = document.getElementById("staffSelect");
  var dateInput = document.getElementById("appointmentDate");
  var hiddenTime = document.getElementById("hiddenTime");
  var sumStaff = document.getElementById("sumStaff");
  var sumDate = document.getElementById("sumDate");
  var sumTime = document.getElementById("sumTime");
  var timeButtons = document.querySelectorAll(".ba-time-btn");
  var bookingForm = document.getElementById("bookingForm");
  var confirmBtn = document.getElementById("confirmBtn");

  if (staffSelect && sumStaff) {
    staffSelect.addEventListener("change", function () {
      var selectedOption = staffSelect.options[staffSelect.selectedIndex];
      sumStaff.textContent = selectedOption ? selectedOption.text.trim() : "—";
    });

    if (staffSelect.options.length === 2) {
      staffSelect.selectedIndex = 1;
      sumStaff.textContent = staffSelect.options[1].text.trim();
    }
  }

  if (dateInput && sumDate) {
    dateInput.addEventListener("change", function () {
      if (!dateInput.value) {
        sumDate.textContent = "—";
        return;
      }

      var date = new Date(dateInput.value + "T00:00:00");

      sumDate.textContent = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    });
  }

  var selectedButton =
    document.querySelector(".ba-time-btn.selected") || timeButtons[0];

  if (selectedButton && hiddenTime && sumTime) {
    hiddenTime.value = selectedButton.dataset.value || "";
    sumTime.textContent = selectedButton.textContent.trim();
  }

  timeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      timeButtons.forEach(function (btn) {
        btn.classList.remove("selected");
      });

      button.classList.add("selected");

      if (hiddenTime) {
        hiddenTime.value = button.dataset.value || "";
      }

      if (sumTime) {
        sumTime.textContent = button.textContent.trim();
      }
    });
  });

  if (bookingForm && confirmBtn) {
    bookingForm.addEventListener("submit", function (event) {
      var hasStaff = staffSelect && staffSelect.value;
      var hasDate = dateInput && dateInput.value;
      var hasTime = hiddenTime && hiddenTime.value;

      if (!hasStaff || !hasDate || !hasTime) {
        event.preventDefault();
        alert(
          "Please select a staff member, date, and time slot before confirming.",
        );
        return;
      }

      confirmBtn.disabled = true;
      confirmBtn.innerHTML = "Booking...";
    });
  }
});
