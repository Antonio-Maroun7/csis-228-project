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
    appointmentStartAt: entity.appointment_start_at,
    appointmentEndsAt: entity.appointment_ends_at,
    appointmentStatus: entity.appointment_status,
    appointmentNotes: entity.appointment_notes,
    appointmentCreatedAt: entity.appointment_created_at,
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
module.exports = { entityToResponseDto, entityToListDto };
