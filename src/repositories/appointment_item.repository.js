/**
 * Repository for persisting appointment_items records.
 */
const pool = require("../db/pool");
const AppointmentItemEntity = require("../entities/appointment_item.entity");

/**
 * Executes appointment item SQL operations.
 */
class AppointmentItemRepository {
  /**
   * Creates an appointment item row.
   * Side effects: inserts one row into appointment_items.
   * @param {{ appointment_id: number|string, service_id: number|string, appointment_duration_min: number, appointment_price_cents: number }} param0
   * @returns {Promise<AppointmentItemEntity|null>}
   */
  static async createAppointmentItem({
    appointment_id,
    service_id,
    appointment_duration_min,
    appointment_price_cents,
  }) {
    const q = `
    INSERT into appointment_items
    (appointment_id,service_id,appointment_duration_min,appointment_price_cents)
    values($1,$2,$3,$4)
    RETURNING  appointment_id, service_id,
                appointment_duration_min, appointment_price_cents`;

    const params = [
      appointment_id,
      service_id,
      appointment_duration_min,
      appointment_price_cents,
    ];
    const { rows } = await pool.query(q, params);
    return AppointmentItemEntity.fromRow(rows[0]);
  }

  /**
   * Finds a single appointment item by its primary key.
   * @param {number|string} appointment_item_id
   * @returns {Promise<AppointmentItemEntity|null>}
   */
  static async findAppointmentItemById(appointment_item_id) {
    const q = `
    SELECT appointment_item_id,appointment_id,service_id,
    appointment_duration_min,appointment_price_cents
    FROM appointment_items
    WHERE appointment_item_id = $1
    LIMIT 1  
    `;
    const { rows } = await pool.query(q, [appointment_item_id]);
    return rows[0] ? AppointmentItemEntity.fromRow(rows[0]) : null;
  }

  /**
   * Returns all appointment items for a given appointment.
   * @param {number|string} appointment_id
   * @returns {Promise<AppointmentItemEntity[]>}
   */
  static async findAppointmentItemByAppointmentId(appointment_id) {
    const q = `
    SELECT appointment_item_id,appointment_id,service_id,
    appointment_duration_min,appointment_price_cents
    FROM appointment_items
    WHERE appointment_id = $1
    ORDER BY appointment_item_id ASC
    `;
    const { rows } = await pool.query(q, [appointment_id]);
    return AppointmentItemEntity.fromRows(rows);
  }

  /**
   * Updates an appointment item record by id.
   * Side effects: updates one row in appointment_items.
   * @param {number|string} appointment_item_id
   * @param {{ service_id: number|string, appointment_duration_min: number, appointment_price_cents: number }} param1
   * @returns {Promise<AppointmentItemEntity|null>}
   */
  static async UpdateAppointmentItem(
    appointment_item_id,
    { service_id, appointment_duration_min, appointment_price_cents },
  ) {
    const q = `
    UPDATE appointment_items
    SET 
    service_id = $1,
    appointment_duration_min = $2,
    appointment_price_cents = $3
    WHERE appointment_item_id = $4
    RETURNING appointment_item_id,appointment_id,service_id,
    appointment_duration_min,appointment_price_cents
    `;
    const params = [
      service_id,
      appointment_duration_min,
      appointment_price_cents,
      appointment_item_id,
    ];
    const { rows } = await pool.query(q, params);
    return rows[0] ? AppointmentItemEntity.fromRow(rows[0]) : null;
  }

  /**
   * Deletes an appointment item record by id.
   * Side effects: deletes one row from appointment_items.
   * @param {number|string} appointment_item_id
   * @returns {Promise<AppointmentItemEntity|null>}
   */
  static async deleteAppointmentItem(appointment_item_id) {
    const q = `
    DELETE 
    FROM appointment_items
    WHERE appointment_item_id = $1
    RETURNING appointment_item_id,appointment_id,service_id,
    appointment_duration_min,appointment_price_cents
    `;
    const { rows } = await pool.query(q, [appointment_item_id]);
    return rows[0] ? AppointmentItemEntity.fromRow(rows[0]) : null;
  }
}
module.exports = AppointmentItemRepository;
