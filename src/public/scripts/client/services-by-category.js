"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var searchForm = document.getElementById("dashboardSearchForm");
  var searchInput = document.getElementById("dashboardSearchInput");
  var serviceCards = document.querySelectorAll("[data-service-card]");
  var searchEmptyState = document.getElementById("searchEmptyState");

  if (searchForm) {
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      var searchValue = searchInput.value.trim().toLowerCase();
      var visibleCount = 0;

      serviceCards.forEach(function (card) {
        var searchText = card.dataset.searchText || "";
        var shouldShow = searchText.includes(searchValue);
        card.style.display = shouldShow ? "" : "none";
        if (shouldShow) visibleCount += 1;
      });

      if (searchEmptyState) {
        searchEmptyState.hidden = visibleCount !== 0;
      }
    });
  }
});
