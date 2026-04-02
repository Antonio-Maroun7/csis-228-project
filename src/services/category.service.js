const CategoryRepository = require("../repositories/category.repository");
const CategoryDto = require("../dto/category.dto");

class CategoryService {
  static async getAllCategories() {
    const categories = await CategoryRepository.findCategories();
    return CategoryDto.toListDto(categories);
  }
}
module.exports = CategoryService;
