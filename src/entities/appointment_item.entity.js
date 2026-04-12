/**
 * appointment_item entity - represents the appointments  row from the database.
 * Uses DB column names (snake_case).
 */

class AppointmentItemEntity {
  /**
   * Creates an appointment item entity from DB row data.
   * @param {{ appointment_item_id?: number, appointment_id?: number, service_id?: number, appointment_duration_min?: number, appointment_price_cents?: number }} param0
   */
  constructor({
    appointment_item_id,
    appointment_id,
    service_id,
    appointment_duration_min,
    appointment_price_cents,
  }) {
    this.appointment_item_id = appointment_item_id;
    this.appointment_id = appointment_id;
    this.service_id = service_id;
    this.appointment_duration_min = appointment_duration_min;
    this.appointment_price_cents = appointment_price_cents;
  }

  /**
   * Builds one appointment item entity from a DB row.
   * @param {Object|undefined|null} row
   * @returns {AppointmentItemEntity|null}
   */
  static fromRow(row) {
    if (!row) return null;
    return new AppointmentItemEntity(row);
  }

  /**
   * Builds appointment item entities from DB rows.
   * @param {Array<Object>} rows
   * @returns {AppointmentItemEntity[]}
   */
  static fromRows(rows) {
    return (rows || []).map((row) => AppointmentItemEntity.fromRow(row));
  }
}
module.exports = AppointmentItemEntity;
