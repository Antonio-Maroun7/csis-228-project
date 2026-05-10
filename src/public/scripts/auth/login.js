"use strict";

(function () {
  var passwordInput = document.getElementById("user_password");
  var togglePassword = document.getElementById("togglePassword");

  if (passwordInput && togglePassword) {
    togglePassword.addEventListener("click", function () {
      var isPasswordHidden = passwordInput.type === "password";
      passwordInput.type = isPasswordHidden ? "text" : "password";
      togglePassword.textContent = isPasswordHidden ? "🙈" : "👁️";
      togglePassword.setAttribute(
        "aria-label",
        isPasswordHidden ? "Hide password" : "Show password",
      );
    });
  }
})();
