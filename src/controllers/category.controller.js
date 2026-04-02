const CategoryService = require("../services/category.service");
const handleError = require("../utils/errorHandler");

class CategoryController {
  static async getAllCategories(req, res) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.json(categories);
    } catch (err) {
      handleError(res, err);
    }
  }
}
module.exports = CategoryController;
