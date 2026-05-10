"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // Give immediate visual feedback when a calendar day is clicked
  document
    .querySelectorAll("a.sd-cal-cell:not(.empty)")
    .forEach(function (cell) {
      cell.addEventListener("click", function () {
        // Briefly dim the cell to indicate navigation is starting
        cell.style.opacity = "0.55";
      });
    });
});
