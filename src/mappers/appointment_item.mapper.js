/**
 * Appointment_item mapper – dedicated conversions between AppointmentItemEntity and appointmentItem DTOs.
 * Single place for all entity ↔ DTO mapping logic.
 *
 *
 */

const AppointmentItemEntity = require("../entities/appointment_item.entity");

/** * Converts one appointment item entity to response DTO.
 * Direction: entity -> response DTO.
 * @param {AppointmentItemEntity | null} entity
 * @returns {{
 *   id: number,
 *  appointmentId: number,
 *  service_id: number,
 * appointment_duration_min: integer,
 * appointment_price_cents: integer,
 * } | null}
 * */
const entityToResponseDto = (entity) => {
  if (!entity) return null;
  return {
    id: entity.appointment_item_id,
    appointmentId: entity.appointment_id,
    serviceId: entity.service_id,
    ItemDurationMin: entity.appointment_duration_min,
    ItemPriceCents: entity.appointment_price_cents,
  };
};

/** * Converts appointment item entities to response DTO list.
 * Direction: entities -> response DTO list.
 * @param {AppointmentItemEntity[]} entities
 * @returns {{
 *   id: number,
 *  appointmentId: number,
 *  service_id: number,
 * appointment_duration_min: integer,
 * appointment_price_cents: integer,
 * }[]}
 * */
const entityToListDto = (entities) => {
  return (entities || []).map(entityToResponseDto);
};

/**
 * Converts create request payload into normalized numeric values.
 * Direction: request DTO -> internal object.
 * @param {Object} data
 * @returns {{ appointment_id: number, service_id: number, appointment_duration_min: number, appointment_price_cents: number }}
 */
const fromCreateRequest = (data) => {
  return {
    appointment_id: Number(data.appointment_id),
    service_id: Number(data.service_id),
    appointment_duration_min: Number(data.appointment_duration_min),
    appointment_price_cents: Number(data.appointment_price_cents),
  };
};

module.exports = { entityToResponseDto, entityToListDto, fromCreateRequest };
