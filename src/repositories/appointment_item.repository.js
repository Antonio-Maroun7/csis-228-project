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
}
module.exports = AppointmentItemRepository;
