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

  static async getCategoryById(category_id) {
    const q = `
    SELECT *
    FROM categories
    WHERE category_id = $1`;
    const params = [category_id];
    const { rows } = await pool.query(q, params);
    return CategoryEntity.fromRow(rows[0]);
  }

  static async createCategory({
    category_name,
    category_description,
    category_is_active,
  }) {
    const q = `
    INSERT INTO categories
    (category_name, category_description, category_is_active)
    values($1,$2,$3)
    RETURNING category_id, category_name, category_description, category_is_active`;
    const params = [category_name, category_description, category_is_active];
    const { rows } = await pool.query(q, params);
    return CategoryEntity.fromRow(rows[0]);
  }
  static async updateCategory(
    category_id,
    { category_name, category_description, category_is_active },
  ) {
    const q = `
    UPDATE categories
    SET  category_name = $1,
    category_description = $2,
    category_is_active = $3
    WHERE category_id = $4
    RETURNING category_id, category_name, category_description, category_is_active`;
    const params = [
      category_name,
      category_description,
      category_is_active,
      category_id,
    ];
    const { rows } = await pool.query(q, params);
    return CategoryEntity.fromRow(rows[0]);
  }

  static async disableCategory(category_id) {
    const q = `
    UPDATE categories
    SET category_is_active = false
    WHERE category_id = $1
    RETURNING category_id, category_name, category_description, category_is_active`;
    const params = [category_id];
    const { rows } = await pool.query(q, params);
    return CategoryEntity.fromRow(rows[0]);
  }
}
module.exports = CategoryRepository;
