"use strict";

(function () {
  var tabs = document.querySelectorAll(".ma-tab");
  var cards = document.querySelectorAll(".ma-card");
  var filterMsg = document.getElementById("ma-filter-empty");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.remove("ma-tab--active");
      });
      tab.classList.add("ma-tab--active");

      var filter = tab.getAttribute("data-filter");
      var visible = 0;

      cards.forEach(function (card) {
        if (filter === "all" || card.getAttribute("data-status") === filter) {
          card.style.display = "";
          visible++;
        } else {
          card.style.display = "none";
        }
      });

      if (filterMsg) {
        filterMsg.classList.toggle("ma-empty--hidden", visible > 0);
      }
    });
  });
})();
