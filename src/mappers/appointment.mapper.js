/**
 * Appointment mapper – dedicated conversions between AppointmentEntity and appointment DTOs.
 * Single place for all entity ↔ DTO mapping logic.
 *
 *
 */

const AppointmentEntity = require("../entities/appointment.entity");

/** * Entity → response DTO (single appointment).
 * @param {AppointmentEntity | null} entity
 * @returns {{
 *   id: number,
 *  clientId: number,
 *  staffId: number,
 * appointmentStartAt: string,
 * appointmentEndsAt: string,
 * appointmentStatus: string,
 * appointmentNotes: string | null,
 * appointmentCreatedAt: string
 * } | null}
 * */
const entityToResponseDto = (entity) => {
  if (!entity) return null;

  return {
    id: entity.appointment_id,
    clientId: entity.client_id,
    staffId: entity.staff_id,
    appointmentStartAt: entity.appointment_start_at
      ? entity.appointment_start_at
      : null,
    appointmentEndsAt: entity.appointment_ends_at[0]
      ? entity.appointment_ends_at[0]
      : null,
    appointmentStatus: entity.appointment_status,
    appointmentNotes: entity.appointment_notes,
    appointmentCreatedAt: entity.appointment_created_at
      ? entity.appointment_created_at
      : null,
  };
};

/** * Entities → list of response DTOs.
 * @param {AppointmentEntity[]} entities
 * @returns {{  id: number,
 *  clientId: number,
 *  staffId: number,
 * appointmentStartAt: string,
 * appointmentEndsAt: string,
 * appointmentStatus: string,
 * appointmentNotes: string | null,
 * appointmentCreatedAt: string}[]}
 * */

const entityToListDto = (entities) => {
  return (entities || []).map(entityToResponseDto);
};

/** * Request body → data for creating an appointment.
 * @param {Object} body
 * @return {{
 *  client_id: number,
 *  staff_id: number | null,
 * starts_at: string,
 * service_items: number[],
 * appointment_notes: string | null
 * }}
 * */
const createRequestToData = (body) => {
  return {
    client_id: body.client_id,
    staff_id: body.staff_id ?? null,
    starts_at: body.starts_at,
    service_items: body.service_items || [],
    appointment_notes: body.appointment_notes ?? null,
  };
};
module.exports = { entityToResponseDto, entityToListDto, createRequestToData };
