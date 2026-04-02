const express = require("express");
const CategoryContorller = require("../controllers/category.controller");
const {} = require("../validators/category.validator");

const router = express.Router();

router.get("/GetAllCategories", CategoryContorller.getAllCategories);
router.get("/GetCategoryById/:id", CategoryContorller.getCategoryById);
router.post("/CreateCategory", CategoryContorller.createCategory);
module.exports = router;
