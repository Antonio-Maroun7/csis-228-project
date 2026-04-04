const { pool } = require("../db/pool");
const AppointmentEntity = require("../entities/appointment.entity");

class AppointmentRepository {
  static async findAppointmentsByClient(client_id) {
    const query = `
    SELECT * 
    FROM appointments
    WHERE client_id = $1
    ORDER BY appointment_starts_at DESC
    `;
    const { rows } = await pool.query(query, [client_id]);
    return AppointmentEntity.fromRow(rows);
  }

  static async createAppointment({
    client_id,
    staff_id,
    appointment_start_at,
    appointment_ends_at,
    appointment_status = "pending",
    appointment_notes = null,
  }) {
    const q = `
    INSERT INTO appointments
    (client_id, staff_id, appointment_start_at, appointment_ends_at, 
    appointment_status, appointment_notes)
    values($1,$2,$3,$4,$5,$6)
    RETURNING appointment_id, client_id, staff_id, appointment_start_at, 
    appointment_ends_at, appointment_status, appointment_notes, 
    appointment_created_at`;
    const params = [
      client_id,
      staff_id,
      appointment_start_at,
      appointment_ends_at,
      appointment_status,
      appointment_notes,
    ];
    const { rows } = await pool.query(q, params);
    return AppointmentEntity.fromRow(rows[0]);
  }
}
module.exports = AppointmentRepository;
