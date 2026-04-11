/**
 * Repository for appointments table persistence and overlap checks.
 */
const pool = require("../db/pool");
const AppointmentEntity = require("../entities/appointment.entity");
const AppointmentWithClientEntity = require("../entities/appointmentWithClient.entity");

/**
 * Executes appointment SQL operations.
 */
class AppointmentRepository {
  /**
   * Creates an appointment row.
   * Side effects: inserts one row into appointments.
   * @param {{ client_id: number|string, staff_id: number|string, appointment_start_at: Date|string, appointment_ends_at: Date|string, appointment_status?: string, appointment_notes?: string|null }} param0
   * @returns {Promise<AppointmentEntity|null>}
   */
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
  /**
   * Returns appointments for one client.
   * @param {number|string} client_id
   * @returns {Promise<AppointmentEntity[]>}
   */
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

  /**
   * Returns appointments for one staff member.
   * @param {number|string} staff_id
   * @returns {Promise<AppointmentEntity[]>}
   */
  static async findAppointmentsByStaff(staff_id) {
    const q = `
    SELECT * 
    FROM appointments
    WHERE staff_id =$1
    ORDER BY appointment_start_at DESC`;
    const { rows } = await pool.query(q, [staff_id]);
    return AppointmentEntity.fromRows(rows);
  }
  /**
   * Finds one appointment by id.
   * @param {number|string} appointment_id
   * @returns {Promise<AppointmentEntity|null>}
   */
  static async findAppointmentById(appointment_id) {
    const q = `
    SELECT * 
    FROM appointments
    WHERE appointment_id = $1
    ORDER BY appointment_start_at DESC`;
    const { rows } = await pool.query(q, [appointment_id]);
    return AppointmentEntity.fromRow(rows[0]);
  }
  /**
   * Updates appointment status by id.
   * Side effects: updates one row in appointments.
   * @param {number|string} appointment_id
   * @param {string} status
   * @returns {Promise<AppointmentEntity|null>}
   */
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
  /**
   * Updates appointment details by id.
   * Side effects: updates one row in appointments.
   * @param {number|string} appointment_id
   * @param {{ client_id: number|string, staff_id: number|string, appointment_start_at: Date|string, appointment_ends_at: Date|string, appointment_notes?: string|null }} param1
   * @returns {Promise<AppointmentEntity|null>}
   */
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
  /**
   * Checks whether a staff appointment overlaps an existing one.
   * @param {number|string} staff_id
   * @param {Date|string} appointment_start_at
   * @param {Date|string} appointment_ends_at
   * @param {number|string|null} [exclude_appointment_id]
   * @returns {Promise<AppointmentEntity|null>}
   */
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
  /**
   * Returns appointments created between two dates with associated client details.
   * @param {Date|string} start_date
   * @param {Date|string} end_date
   * @returns {Promise<AppointmentWithClientEntity[]>}
   */
  static async findAppointmentBetweenDates(start_date, end_date) {
    const q = `
    SELECT
      a.appointment_id,
      a.client_id,
      a.staff_id,
      a.appointment_start_at,
      a.appointment_ends_at,
      a.appointment_status,
      a.appointment_notes,
      a.appointment_created_at,
      u.user_fullname AS client_fullname,
      u.user_email AS client_email,
      u.user_role AS client_role,
      u.user_phone AS client_phone,
      u.user_is_active AS client_is_active
    FROM appointments a
    JOIN users u ON a.client_id = u.user_id
    WHERE a.appointment_created_at BETWEEN $1 AND $2
    ORDER BY a.appointment_created_at DESC
    `;
    const { rows } = await pool.query(q, [start_date, end_date]);
    return AppointmentWithClientEntity.fromRows(rows);
  }
}
module.exports = AppointmentRepository;
