/**
 * appointment entity - represents the appointments  row from the database.
 * Uses DB column names (snake_case).
 */
class AppointmentEntity {
  /**
   * Creates an appointment entity with DB column properties.
   * @param {{ appointment_id?: number, client_id?: number, staff_id?: number, appointment_start_at?: Date|string|null, appointment_ends_at?: Date|string|null, appointment_status?: string, appointment_notes?: string|null, appointment_created_at?: Date|string|null }} param0
   */
  constructor({
    appointment_id,
    client_id,
    staff_id,
    appointment_start_at,
    appointment_ends_at,
    appointment_status,
    appointment_notes,
    appointment_created_at,
  }) {
    this.appointment_id = appointment_id;
    this.client_id = client_id;
    this.staff_id = staff_id;
    this.appointment_start_at = appointment_start_at;
    this.appointment_ends_at = appointment_ends_at;
    this.appointment_status = appointment_status;
    this.appointment_notes = appointment_notes;
    this.appointment_created_at = appointment_created_at;
  }

  /**
   * Builds one appointment entity from a DB row.
   * @param {Object|undefined|null} row
   * @returns {AppointmentEntity|null}
   */
  static fromRow(row) {
    if (!row) return null;
    return new AppointmentEntity(row);
  }

  /**
   * Builds appointment entities from DB rows.
   * @param {Array<Object>} rows
   * @returns {AppointmentEntity[]}
   */
  static fromRows(rows) {
    return (rows || []).map((row) => AppointmentEntity.fromRow(row));
  }
}
module.exports = AppointmentEntity;
