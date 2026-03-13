const express = require("express");
const UserController = require("../controllers/user.controller");
const { validatorUserId } = require("../validators/user.validator");

const router = express.Router();

router.put("/password/:id", UserController.changeUserPassword);
router.delete("/:id", UserController.deleteUser);
router.get("/email/:email", UserController.getUserBYEmail);
router.put("/:id", UserController.UpdateUser);
router.post("/", UserController.createUser);
router.get("/", UserController.getAllUsers);
router.get("/:id", validatorUserId, UserController.getUserBYId);

module.exports = router;
