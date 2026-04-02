/**
 * categories entity - represents the categories row from the database.
 * Uses DB column names (snake_case).
 */

class CategoryEntity {
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

  static fromRow(row) {
    if (!row) return null;
    return new CategoryEntity(row);
  }

  static fromRows(rows) {
    return (rows || []).map((row) => CategoryEntity.fromRow(row));
  }
}
module.exports = CategoryEntity;
