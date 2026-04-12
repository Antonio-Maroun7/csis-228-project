/**
 * Category routes for listing, creating, updating, and disabling categories.
 */
const express = require("express");
const CategoryContorller = require("../controllers/category.controller");
const {
  validatorCategoryId,
  validatorCreateCategory,
  validatorUpdateCategory,
} = require("../validators/category.validator");
const { authenticate } = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

const router = express.Router();

router.get(
  "/GetAllCategories",
  authenticate,
  authorize(["admin", "staff", "client"]),
  CategoryContorller.getAllCategories,
);
router.get(
  "/GetCategoryById/:id",
  authenticate,
  authorize(["admin", "staff", "client"]),
  ...validatorCategoryId,
  CategoryContorller.getCategoryById,
);
router.post(
  "/CreateCategory",
  authenticate,
  authorize(["admin"]),
  ...validatorCreateCategory,
  CategoryContorller.createCategory,
);
router.put(
  "/UpdateCategory/:id",
  authenticate,
  authorize(["admin"]),
  ...validatorUpdateCategory,
  CategoryContorller.updateCategory,
);
router.put(
  "/DisableCategory/:id",
  authenticate,
  authorize(["admin"]),
  ...validatorCategoryId,
  CategoryContorller.disableCategory,
);
module.exports = router;
