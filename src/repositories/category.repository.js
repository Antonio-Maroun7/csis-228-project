const pool = require("../db/pool");
const CategoryEntity = require("../entities/category.entity");

class CategoryRepository {
  static async findCategories() {
    const { rows } = await pool.query(`
    SELECT *
    FROM categories
    ORDER BY category_id`);
    return CategoryEntity.fromRows(rows);
  }
}
module.exports = CategoryRepository;
