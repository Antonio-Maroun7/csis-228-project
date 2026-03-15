const express = require("express");
const UserController = require("../controllers/user.controller");
const {
  validatorUserId,
  validatorCreateUser,
  validatorUpdateUser,
  validatorUserEmail,
} = require("../validators/user.validator");

const router = express.Router();

router.put("/password/:id", UserController.changeUserPassword);
router.delete("/deleteUser/:id", UserController.deleteUser);
router.get(
  "/email/:user_email",
  validatorUserEmail,
  UserController.getUserBYEmail,
);
router.put("/:id", validatorUpdateUser, UserController.UpdateUser);
router.post("/", validatorCreateUser, UserController.createUser);
router.get("/", UserController.getAllUsers);
router.get("/:id", validatorUserId, UserController.getUserBYId);

module.exports = router;
