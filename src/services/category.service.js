/**
 * Category service for category retrieval and state changes.
 */
const CategoryRepository = require("../repositories/category.repository");
const CategoryDto = require("../dto/category.dto");

/**
 * Handles category business operations and DTO mapping.
 */
class CategoryService {
  /**
   * Fetches all categories.
   * @returns {Promise<Array<Object>>}
   */
  static async getAllCategories() {
    const entities = await CategoryRepository.findCategories();
    return CategoryDto.toListDto(entities);
  }

  /**
   * Fetches one category by id.
   * @param {number|string} id
   * @returns {Promise<Object>}
   * @throws {Error} When category is not found.
   */
  static async getCategoryById(id) {
    try {
      const entity = await CategoryRepository.getCategoryById(id);
      if (!entity) {
        throw new Error("Category not found");
      }
      return CategoryDto.toResponseDto(entity);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }

  /**
   * Creates a category.
   * Side effects: inserts a row into categories.
   * @param {Object} data
   * @returns {Promise<Object|null>}
   */
  static async createCategory(data) {
    try {
      const entity = await CategoryRepository.createCategory(data);
      return CategoryDto.toResponseDto(entity);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }
  /**
   * Updates a category by id.
   * Side effects: updates one categories row.
   * @param {number|string} id
   * @param {Object} data
   * @returns {Promise<Object>}
   * @throws {Error} When category is missing or update fails.
   */
  static async updateCategory(id, data) {
    try {
      const existingCategory = await CategoryRepository.getCategoryById(id);
      if (!existingCategory) {
        throw new Error("Category not found");
      }
      const updatedCategory = await CategoryRepository.updateCategory(id, data);
      if (!updatedCategory) {
        throw new Error("Failed to update category");
      }
      return CategoryDto.toResponseDto(updatedCategory);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }

  /**
   * Marks a category as disabled.
   * Side effects: updates category_is_active in categories.
   * @param {number|string} id
   * @returns {Promise<Object>}
   * @throws {Error} When category is missing or disable operation fails.
   */
  static async disableCategory(id) {
    try {
      const exsitingCategory = await CategoryRepository.getCategoryById(id);
      if (!exsitingCategory) {
        throw new Error("Category not found");
      }
      const disabledCategory = await CategoryRepository.disableCategory(id);
      if (!disabledCategory) {
        throw new Error("Failed to disable category");
      }
      return CategoryDto.toResponseDto(disabledCategory);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }
}
module.exports = CategoryService;
