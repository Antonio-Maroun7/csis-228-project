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

  validateChangePasswordByEmail,
} = require("../validators/user.validator");
const authorize = require("../middleware/authorize.middleware");

const router = express.Router();

router.put(
  "/changePasswordByEmail/:user_email",
  authenticate,
  authorize(["admin", "client", "staff"]),
  authorize.selfByEmailOrRoles(["admin"]),
  ...validateChangePasswordByEmail,
  UserController.changeUserPassword,
);
router.delete(
  "/deleteUser/:id",
  authenticate,
  authorize(["admin"]),
  ...validatorDeleteUser,
  UserController.deleteUser,
);
router.get(
  "/email/:user_email",
  authenticate,
  authorize(["admin", "client", "staff"]),
  authorize.selfByEmailOrRoles(["admin"]),
  ...validatorUserEmail,
  UserController.getUserBYEmail,
);
router.put(
  "/UpdateUser/:id",
  authenticate,
  authorize(["admin", "client", "staff"]),
  authorize.selfByIdOrRoles(["admin"]),
  ...validatorUpdateUser,
  UserController.UpdateUser,
);

router.get("/", authenticate, authorize(["admin"]), UserController.getAllUsers);

router.get(
  "/:id",
  authenticate,
  authorize(["client", "staff", "admin"]),
  authorize.selfByIdOrRoles(["admin", "staff"]),
  ...validatorUserId,
  UserController.getUserBYId,
);

module.exports = router;
