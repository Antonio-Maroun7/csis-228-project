/**
 * categories entity - represents the categories row from the database.
 * Uses DB column names (snake_case).
 */

class CategoryEntity {
  /**
   * Creates a category entity with DB column properties.
   * @param {{ category_id?: number, category_name?: string, category_description?: string|null, category_is_active?: boolean }} [param0]
   */
  constructor({
    category_id,
    category_name,
    category_description,
    category_is_active,
  } = {}) {
    this.category_id = category_id;
    this.category_name = category_name;
    this.category_description = category_description;
    this.category_is_active = category_is_active;
  }

  /**
   * Builds one category entity from a DB row.
   * @param {Object|undefined|null} row
   * @returns {CategoryEntity|null}
   */
  static fromRow(row) {
    if (!row) return null;
    return new CategoryEntity(row);
  }

  /**
   * Builds category entities from DB rows.
   * @param {Array<Object>} rows
   * @returns {CategoryEntity[]}
   */
  static fromRows(rows) {
    return (rows || []).map((row) => CategoryEntity.fromRow(row));
  }
}
module.exports = CategoryEntity;
