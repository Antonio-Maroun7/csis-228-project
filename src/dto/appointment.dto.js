/**
 * Appointment DTOs – API contract (camelCase response/request shapes).
 * All entity ↔ DTO conversion is done in the appointment mapper.
 */

const AppointmentMapper = require("../mappers/appointment.mapper");
module.exports = {
  toResponseDto: AppointmentMapper.entityToResponseDto,
  toListDto: AppointmentMapper.entityToListDto,
};
