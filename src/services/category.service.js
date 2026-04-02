const CategoryRepository = require("../repositories/category.repository");
const CategoryDto = require("../dto/category.dto");

class CategoryService {
  static async getAllCategories() {
    const entities = await CategoryRepository.findCategories();
    return CategoryDto.toListDto(entities);
  }

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

  static async createCategory(data) {
    try {
      const entity = await CategoryRepository.createCategory(data);
      return CategoryDto.toResponseDto(entity);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }
}
module.exports = CategoryService;
