/**
 * AppointmentItems DTOs – API contract (camelCase response/request shapes).
 * All entity ↔ DTO conversion is done in the appointmentItem mapper.
 */
const AppointmentItemMapper = require("../mappers/appointment_item.mapper");

/**
 * Maps one AppointmentItemEntity to response DTO.
 * Direction: entity -> response DTO.
 * @type {(entity: Object|null) => Object|null}
 */
const toResponseDto = AppointmentItemMapper.entityToResponseDto;

/**
 * Maps appointment item entities to response DTO list.
 * Direction: entities -> response DTO list.
 * @type {(entities: Array<Object>) => Array<Object>}
 */
const toListDto = AppointmentItemMapper.entityToListDto;

/**
 * Converts create request payload into repository input shape.
 * Direction: request DTO -> internal object.
 * @type {(data: Object) => Object}
 */
const toCreateRequest = AppointmentItemMapper.fromCreateRequest;

module.exports = {
  toResponseDto,
  toListDto,
  toCreateRequest,
};
