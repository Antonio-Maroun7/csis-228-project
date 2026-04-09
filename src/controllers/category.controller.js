/**
 * Category controller for category endpoint handlers.
 */
const CategoryService = require("../services/category.service");
const { handleError } = require("../utils/errorHandler");

/**
 * Handles category-related HTTP requests.
 */
class CategoryController {
  /**
   * Returns all categories.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async getAllCategories(req, res) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.json(categories);
    } catch (err) {
      return handleError(res, err);
    }
  }
  /**
   * Returns one category identified by req.params.id.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async getCategoryById(req, res) {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);
      res.json(category);
    } catch (err) {
      return handleError(res, err);
    }
  }
  /**
   * Creates a category using request body data.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async createCategory(req, res) {
    try {
      const category = await CategoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (err) {
      return handleError(res, err);
    }
  }
  /**
   * Updates an existing category by req.params.id with req.body values.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async updateCategory(req, res) {
    try {
      const category = await CategoryService.updateCategory(
        req.params.id,
        req.body,
      );
      res
        .status(200)
        .json({ message: "Category updated successfully", category });
    } catch (err) {
      return handleError(res, err);
    }
  }

  /**
   * Disables a category identified by req.params.id.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async disableCategory(req, res) {
    try {
      const category = await CategoryService.disableCategory(req.params.id);
      res
        .status(200)
        .json({ message: "Category disabled successfully", category });
    } catch (err) {
      return handleError(res, err);
    }
  }
}
module.exports = CategoryController;
