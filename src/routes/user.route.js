const express = require("express");
const UserController = require("../controllers/user.controller");

const router = express.Router();

router.delete("/:id", UserController.deleteUser);
router.get("/email/:email", UserController.getUserBYEmail);
router.put("/:id", UserController.UpdateUser);
router.post("/", UserController.createUser);
router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserBYId);

module.exports = router;
