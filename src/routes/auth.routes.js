/**
 * Authentication routes for login and user registration.
 */
const express = require("express");
const AuthController = require("../controllers/auth.controller");
const {
  validatorRegisterUser,
  validatorLoginUser,
} = require("../validators/auth.validator");
const router = express.Router();

router.post("/login", ...validatorLoginUser, AuthController.login);

router.post("/register", ...validatorRegisterUser, AuthController.register);

module.exports = router;
