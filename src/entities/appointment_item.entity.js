/**
 * appointment_item entity - represents the appointments  row from the database.
 * Uses DB column names (snake_case).
 */

const AppointmentEntity = require("./appointment.entity");

class AppointmentItemEntity {
  constructor({
    id,
    appointment_id,
    service_id,
    appointment_duration_min,
    appointment_price_cents,
  }) {
    this.id = id;
    this.appointment_id = appointment_id;
    this.service_id = service_id;
    this.appointment_duration_min = appointment_duration_min;
    this.appointment_price_cents = appointment_price_cents;
  }

  static fromRow(row) {
    if (!row) return null;
    return new AppointmentItemEntity(row);
  }

  static fromRows(rows) {
    return (rows || []).map((row) => AppointmentItemEntity.fromRow(row));
  }
}
module.exports = AppointmentEntity;
