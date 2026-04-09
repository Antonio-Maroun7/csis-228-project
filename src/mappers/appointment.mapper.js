/**
 * Appointment mapper – dedicated conversions between AppointmentEntity and appointment DTOs.
 * Single place for all entity ↔ DTO mapping logic.
 *
 *
 */

const AppointmentEntity = require("../entities/appointment.entity");

/** * Converts one appointment entity into API response DTO.
 * Direction: entity -> response DTO.
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
    appointmentEndsAt: entity.appointment_ends_at
      ? entity.appointment_ends_at
      : null,
    appointmentStatus: entity.appointment_status,
    appointmentNotes: entity.appointment_notes,
    appointmentCreatedAt: entity.appointment_created_at
      ? entity.appointment_created_at
      : null,
  };
};

/** * Converts appointment entities into response DTO list.
 * Direction: entities -> response DTO list.
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

/** * Converts create request body into internal appointment creation payload.
 * Direction: request DTO -> internal object.
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
