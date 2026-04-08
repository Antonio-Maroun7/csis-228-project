/**
 * Appointment_item mapper – dedicated conversions between AppointmentItemEntity and appointmentItem DTOs.
 * Single place for all entity ↔ DTO mapping logic.
 *
 *
 */

const AppointmentItemEntity = require("../entities/appointment_item.entity");

/** * Entity → response DTO (single appointment).
 * @param {AppointmenItemtEntity | null} entity
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
    id: entity.id,
    appointmentId: entity.appointment_id,
    serviceId: entity.service_id,
    ItemDurationMin: entity.appointment_duration_min,
    ItemPriceCents: entity.appointment_price_cents,
  };
};

/** * Entities → list of response DTOs.
 * @param {AppointmenItemtEntity[]} entities
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

const fromCreateRequest = (data) => {
  return {
    appointment_id: Number(data.appointment_id),
    service_id: Number(data.service_id),
    appointment_duration_min: Number(data.appointment_duration_min),
    appointment_price_cents: Number(data.appointment_price_cents),
  };
};

module.exports = { entityToResponseDto, entityToListDto, fromCreateRequest };
