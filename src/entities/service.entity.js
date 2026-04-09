/**
 * services entity - represents the services row from the database.
 * Uses DB column names (snake_case).
 */

class ServiceEntity {
  /**
   * Creates a service entity with DB row fields.
   * @param {{ service_id?: number, category_id?: number, service_name?: string, service_description?: string|null, service_default_duration_min?: number, service_base_price_cents?: number, service_is_active?: boolean }} [param0]
   */
  constructor({
    service_id,
    category_id,
    service_name,
    service_description,
    service_default_duration_min,
    service_base_price_cents,
    service_is_active,
  } = {}) {
    this.service_id = service_id;
    this.category_id = category_id;
    this.service_name = service_name;
    this.service_description = service_description;
    this.service_default_duration_min = service_default_duration_min;
    this.service_base_price_cents = service_base_price_cents;
    this.service_is_active = service_is_active;
  }
  /**
   * Builds one service entity from a DB row.
   * @param {Object|undefined|null} row
   * @returns {ServiceEntity|null}
   */
  static fromRow(row) {
    if (!row) return null;
    return new ServiceEntity(row);
  }

  /**
   * Builds service entities from DB rows.
   * @param {Array<Object>} rows
   * @returns {ServiceEntity[]}
   */
  static fromRows(rows) {
    return (rows || []).map((row) => ServiceEntity.fromRow(row));
  }
}
module.exports = ServiceEntity;
