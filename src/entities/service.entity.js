/**
 * services entity - represents the services row from the database.
 * Uses DB column names (snake_case).
 */

const { fromRow } = require("./user.entity");

class ServiceEntity {
  constructor({
    service_id,
    category_id,
    service_name,
    service_description,
    service_default_duration_min,
    service_default_price_cents,
    service_is_active,
  } = {}) {
    this.service_id = service_id;
    this.category_id = category_id;
    this.service_name = service_name;
    this.service_description = service_description;
    this.service_default_duration_min = service_default_duration_min;
    this.service_default_price_cents = service_default_price_cents;
    this.service_is_active = service_is_active;
  }
  static fromRow(row) {
    if (!row) return null;
    return new ServiceEntity(row);
  }

  static fromRows(rows) {
    return (rows || []).map((row) => ServiceEntity.fromRow(row));
  }
}
module.exports = ServiceEntity;
