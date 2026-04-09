const express = require("express");
const UserController = require("../controllers/user.controller");
const {
  validatorUserId,

  validatorUpdateUser,
  validatorUserEmail,
  validatorDeleteUser,
  validateChangePassword,
} = require("../validators/user.validator");

const router = express.Router();

router.put(
  "/changePassword/:id",
  validateChangePassword,
  UserController.changeUserPassword,
);
router.delete(
  "/deleteUser/:id",
  validatorDeleteUser,
  UserController.deleteUser,
);
router.get(
  "/email/:user_email",
  validatorUserEmail,
  UserController.getUserBYEmail,
);
router.put("/UpdateUser/:id", validatorUpdateUser, UserController.UpdateUser);

router.get("/", UserController.getAllUsers);
router.get("/:id", validatorUserId, UserController.getUserBYId);

module.exports = router;
