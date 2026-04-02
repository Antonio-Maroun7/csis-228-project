const express = require("express");
const CategoryContorller = require("../controllers/category.controller");
const {
  validatorCategoryId,
  validatorCreateCategory,
  validatorUpdateCategory,
} = require("../validators/category.validator");

const router = express.Router();

router.get("/GetAllCategories", CategoryContorller.getAllCategories);
router.get(
  "/GetCategoryById/:id",
  validatorCategoryId,
  CategoryContorller.getCategoryById,
);
router.post(
  "/CreateCategory",
  validatorCreateCategory,
  CategoryContorller.createCategory,
);
router.put(
  "/UpdateCategory/:id",
  validatorUpdateCategory,
  CategoryContorller.updateCategory,
);
module.exports = router;
