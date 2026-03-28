/**
 * staff_services entity - represents the staff_services row from the database.
 * Uses DB column names (snake_case).
 */

class StaffServiceEntity {
  constructor({
    staff_id,
    service_id,
    staff_duration_min,
    staff_price_cents,
  } = {}) {
    this.staff_id = staff_id;
    this.service_id = service_id;
    this.staff_duration_min = staff_duration_min;
    this.staff_price_cents = staff_price_cents;
  }
  static fromRow(row) {
    if (!row) return null;
    return new StaffServiceEntity(row);
  }
  static fromRows(rows) {
    return (rows || []).map((row) => StaffServiceEntity.fromRow(row));
  }
}
module.exports = StaffServiceEntity;
