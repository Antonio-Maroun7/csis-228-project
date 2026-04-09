/**
 * Repository for categories table reads and writes.
 */
const pool = require("../db/pool");
const CategoryEntity = require("../entities/category.entity");

/**
 * Executes category persistence queries.
 */
class CategoryRepository {
  /**
   * Returns all categories.
   * @returns {Promise<CategoryEntity[]>}
   */
  static async findCategories() {
    const { rows } = await pool.query(`
    SELECT *
    FROM categories
    ORDER BY category_id`);
    return CategoryEntity.fromRows(rows);
  }

  /**
   * Finds one category by id.
   * @param {number|string} category_id
   * @returns {Promise<CategoryEntity|null>}
   */
  static async getCategoryById(category_id) {
    const q = `
    SELECT *
    FROM categories
    WHERE category_id = $1`;
    const params = [category_id];
    const { rows } = await pool.query(q, params);
    return CategoryEntity.fromRow(rows[0]);
  }

  /**
   * Creates a category row.
   * Side effects: inserts one row into categories.
   * @param {{ category_name: string, category_description?: string|null, category_is_active?: boolean }} param0
   * @returns {Promise<CategoryEntity|null>}
   */
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
  /**
   * Updates a category row by id.
   * Side effects: updates one categories row.
   * @param {number|string} category_id
   * @param {{ category_name: string, category_description?: string|null, category_is_active?: boolean }} param1
   * @returns {Promise<CategoryEntity|null>}
   */
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

  /**
   * Marks a category as inactive.
   * Side effects: updates category_is_active to false.
   * @param {number|string} category_id
   * @returns {Promise<CategoryEntity|null>}
   */
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
