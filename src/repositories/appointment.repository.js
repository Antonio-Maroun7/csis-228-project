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
}
module.exports = AppointmentRepository;
