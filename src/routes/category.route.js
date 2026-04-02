const express = require("express");
const CategoryContorller = require("../controllers/category.controller");
const {} = require("../validators/category.validator");

const router = express.Router();

router.get("/GetAllCategories", CategoryContorller.getAllCategories);

module.exports = router;
