/**
 * Appointment DTOs – API contract (camelCase response/request shapes).
 * All entity ↔ DTO conversion is done in the appointment mapper.
 */

const AppointmentMapper = require("../mappers/appointment.mapper");

/**
 * Maps one AppointmentEntity to response DTO.
 * Direction: entity -> response DTO.
 * @type {(entity: Object|null) => Object|null}
 */
const toResponseDto = AppointmentMapper.entityToResponseDto;

/**
 * Maps appointment entities to response DTO list.
 * Direction: entities -> response DTO list.
 * @type {(entities: Array<Object>) => Array<Object>}
 */
const toListDto = AppointmentMapper.entityToListDto;

/**
 * Converts appointment create request payload into internal service data shape.
 * Direction: request DTO -> internal object.
 * @type {(body: Object) => Object}
 */
const fromCreateRequest = AppointmentMapper.createRequestToData;

module.exports = {
  toResponseDto,
  toListDto,
  fromCreateRequest,
};
