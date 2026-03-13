const express = require("express");
const UserController = require("../controllers/user.controller");
const {
  validatorUserId,
  validatorCreateUser,
} = require("../validators/user.validator");

const router = express.Router();

router.put("/password/:id", UserController.changeUserPassword);
router.delete("/:id", UserController.deleteUser);
router.get("/email/:email", UserController.getUserBYEmail);
router.put("/:id", UserController.UpdateUser);
router.post("/", validatorCreateUser, UserController.createUser);
router.get("/", UserController.getAllUsers);
router.get("/:id", validatorUserId, UserController.getUserBYId);

module.exports = router;
