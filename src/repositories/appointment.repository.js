const pool = require("../db/pool");
const AppointmentEntity = require("../entities/appointment.entity");

class AppointmentRepository {
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
  static async findAppointmentsByClient(client_id) {
    const q = `
    SELECT * 
    FROM appointments
    WHERE client_id = $1
    ORDER BY appointment_start_at DESC
    `;
    const { rows } = await pool.query(q, [client_id]);
    return AppointmentEntity.fromRows(rows);
  }

  static async findAppointmentsByStaff(staff_id) {
    const q = `
    SELECT * 
    FROM appointments
    WHERE staff_id =$1
    ORDER BY appointment_start_at DESC`;
    const { rows } = await pool.query(q, [staff_id]);
    return AppointmentEntity.fromRows(rows);
  }
  static async findAppointmentById(appointment_id) {
    const q = `
    SELECT * 
    FROM appointments
    WHERE appointment_id = $1
    ORDER BY appointment_start_at DESC`;
    const { rows } = await pool.query(q, [appointment_id]);
    return AppointmentEntity.fromRow(rows[0]);
  }
  static async updateAppointmentStatus(appointment_id, status) {
    const q = `
    UPDATE appointments
    SET appointment_status = $1
    WHERE appointment_id = $2
    RETURNING appointment_id, client_id, staff_id, appointment_start_at, 
    appointment_ends_at, appointment_status, appointment_notes, 
    appointment_created_at`;
    const params = [status, appointment_id];
    const { rows } = await pool.query(q, params);
    return AppointmentEntity.fromRow(rows[0]);
  }
  static async updateAppointment(
    appointment_id,
    {
      client_id,
      staff_id,
      appointment_start_at,
      appointment_ends_at,
      appointment_notes,
    },
  ) {
    try {
      const q = `
      UPDATE appointments 
      SET client_id = $1, staff_id = $2, appointment_start_at = $3,
      appointment_ends_at = $4,  appointment_notes = $5
      WHERE appointment_id = $6
      RETURNING appointment_id, client_id, staff_id, appointment_start_at, 
      appointment_ends_at, appointment_status, appointment_notes, 
      appointment_created_at`;
      const params = [
        client_id,
        staff_id,
        appointment_start_at,
        appointment_ends_at,
        appointment_notes,
        appointment_id,
      ];
      const { rows } = await pool.query(q, params);
      return AppointmentEntity.fromRow(rows[0]);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }
  static async checkStaffAvailability(
    staff_id,
    appointment_start_at,
    appointment_ends_at,
    exclude_appointment_id = null,
  ) {
    let q = `
    SELECT *
    FROM appointments
    WHERE staff_id = $1
       AND appointment_status NOT IN('cancelled','completed')
       AND appointment_start_at < $3
       AND appointment_ends_at > $2`;
    const params = [staff_id, appointment_start_at, appointment_ends_at];

    if (exclude_appointment_id) {
      q += ` AND appointment_id <> $4`;
      params.push(exclude_appointment_id);
    }
    q += ` limit 1`;
    const { rows } = await pool.query(q, params);
    return AppointmentEntity.fromRow(rows[0]);
  }
}
module.exports = AppointmentRepository;
