/**
 * AppointmentItems DTOs – API contract (camelCase response/request shapes).
 * All entity ↔ DTO conversion is done in the appointmentItem mapper.
 */
const AppointmentItemMapper = require("../mappers/appointment_item.mapper");
module.exports = {
  toResponseDto: AppointmentItemMapper.entityToResponseDto,
  toListDto: AppointmentItemMapper.entityToListDto,
  toCreateRequest: AppointmentItemMapper.fromCreateRequest,
};
