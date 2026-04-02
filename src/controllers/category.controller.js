const CategoryService = require("../services/category.service");
const { handleError } = require("../utils/errorHandler");

class CategoryController {
  static async getAllCategories(req, res) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.json(categories);
    } catch (err) {
      return handleError(res, err);
    }
  }
  static async getCategoryById(req, res) {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);
      res.json(category);
    } catch (err) {
      return handleError(res, err);
    }
  }
  static async createCategory(req, res) {
    try {
      const category = await CategoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (err) {
      return handleError(res, err);
    }
  }
}
module.exports = CategoryController;
