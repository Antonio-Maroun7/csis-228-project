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

  var confirmPasswordInput = document.getElementById("confirm_password");
  var toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

  if (confirmPasswordInput && toggleConfirmPassword) {
    toggleConfirmPassword.addEventListener("click", function () {
      var isPasswordHidden = confirmPasswordInput.type === "password";
      confirmPasswordInput.type = isPasswordHidden ? "text" : "password";
      toggleConfirmPassword.textContent = isPasswordHidden ? "🙈" : "👁️";
      toggleConfirmPassword.setAttribute(
        "aria-label",
        isPasswordHidden ? "Hide confirm password" : "Show confirm password",
      );
    });
  }
})();
