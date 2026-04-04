/**
 * appointment entity - represents the appointments  row from the database.
 * Uses DB column names (snake_case).
 */
class AppointmentEntity {
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

  static fromRow(row) {
    if (!row) return null;
    return new AppointmentEntity(row);
  }

  static fromRows(rows) {
    return (rows || []).map((row) => AppointmentEntity.fromRow(row));
  }
}
module.exports = AppointmentEntity;
