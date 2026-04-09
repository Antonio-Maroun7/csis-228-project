/**
 * staff_services entity - represents the staff_services row from the database.
 * Uses DB column names (snake_case).
 */

class StaffServiceEntity {
  /**
   * Creates a staff-service assignment entity.
   * @param {{ staff_id?: number, service_id?: number, staff_duration_min?: number|null, staff_price_cents?: number|null }} [param0]
   */
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
  /**
   * Builds one staff-service entity from a DB row.
   * @param {Object|undefined|null} row
   * @returns {StaffServiceEntity|null}
   */
  static fromRow(row) {
    if (!row) return null;
    return new StaffServiceEntity(row);
  }
  /**
   * Builds staff-service entities from DB rows.
   * @param {Array<Object>} rows
   * @returns {StaffServiceEntity[]}
   */
  static fromRows(rows) {
    return (rows || []).map((row) => StaffServiceEntity.fromRow(row));
  }
}
module.exports = StaffServiceEntity;
