const pool = require("../db/pool");
const AppointmentItemEntity = require("../entities/appointment_item.entity");

class AppointmentItemRepository {
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
