/**
 * User routes for profile retrieval, updates, deletion, and password changes.
 */
const express = require("express");
const UserController = require("../controllers/user.controller");
const { authenticate } = require("../middleware/auth.middleware");
const {
  validatorUserId,

  validatorUpdateUser,
  validatorUserEmail,
  validatorDeleteUser,
  validateChangePassword,
} = require("../validators/user.validator");
const authorize = require("../middleware/authorize.middleware");

const router = express.Router();

router.put(
  "/changePassword/:id",
  ...validateChangePassword,
  UserController.changeUserPassword,
);
router.delete(
  "/deleteUser/:id",
  ...validatorDeleteUser,
  UserController.deleteUser,
);
router.get(
  "/email/:user_email",
  ...validatorUserEmail,
  UserController.getUserBYEmail,
);
router.put(
  "/UpdateUser/:id",
  ...validatorUpdateUser,
  UserController.UpdateUser,
);

router.get(
  "/",
  authenticate,
  authorize(["client"]),
  UserController.getAllUsers,
);
router.get("/:id", ...validatorUserId, UserController.getUserBYId);

module.exports = router;
