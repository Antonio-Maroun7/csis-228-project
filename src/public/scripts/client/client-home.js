"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var searchForm = document.getElementById("dashboardSearchForm");
  var searchInput = document.getElementById("dashboardSearchInput");
  var categoryCards = document.querySelectorAll("[data-category-card]");
  var searchEmptyState = document.getElementById("searchEmptyState");

  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      var val = searchInput.value.trim().toLowerCase();
      var visible = 0;

      categoryCards.forEach(function (card) {
        var text = card.dataset.searchText || "";
        var show = text.includes(val);
        card.style.display = show ? "" : "none";
        if (show) visible++;
      });

      if (searchEmptyState) {
        searchEmptyState.hidden = visible !== 0;
      }
    });
  }
});
