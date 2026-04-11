/**
 * Entity representing appointment rows joined with client user fields.
 * Uses DB-style snake_case field names.
 */
class AppointmentWithClientEntity {
  /**
   * Creates an appointment-with-client entity from a joined row.
   * @param {{
   *   appointment_id?: number,
   *   client_id?: number,
   *   staff_id?: number,
   *   appointment_start_at?: Date|string|null,
   *   appointment_ends_at?: Date|string|null,
   *   appointment_status?: string,
   *   appointment_notes?: string|null,
   *   appointment_created_at?: Date|string|null,
   *   client_fullname?: string,
   *   client_email?: string,
   *   client_role?: string,
   *   client_phone?: string|null,
   *   client_is_active?: boolean
   * }} [param0]
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
    client_fullname,
    client_email,
    client_role,
    client_phone,
    client_is_active,
  } = {}) {
    this.appointment_id = appointment_id;
    this.client_id = client_id;
    this.staff_id = staff_id;
    this.appointment_start_at = appointment_start_at;
    this.appointment_ends_at = appointment_ends_at;
    this.appointment_status = appointment_status;
    this.appointment_notes = appointment_notes;
    this.appointment_created_at = appointment_created_at;
    this.client_fullname = client_fullname;
    this.client_email = client_email;
    this.client_role = client_role;
    this.client_phone = client_phone;
    this.client_is_active = client_is_active;
  }

  /**
   * Builds one entity from a joined database row.
   * @param {Object|undefined|null} row
   * @returns {AppointmentWithClientEntity|null}
   */
  static fromRow(row) {
    if (!row) return null;
    return new AppointmentWithClientEntity(row);
  }

  /**
   * Builds entity list from joined database rows.
   * @param {Array<Object>} rows
   * @returns {AppointmentWithClientEntity[]}
   */
  static fromRows(rows) {
    return (rows || []).map((row) => AppointmentWithClientEntity.fromRow(row));
  }
}

module.exports = AppointmentWithClientEntity;
