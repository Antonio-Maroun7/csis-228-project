/**
 * service DTOs – API contract (camelCase response/request shapes).
 * All entity ↔ DTO conversion is done in the service mapper.
 */
const ServiceMapper = require("../mappers/service.mapper");

/**
 * Maps one ServiceEntity to response DTO.
 * Direction: entity -> response DTO.
 * @type {(entity: Object|null) => Object|null}
 */
const toResponseDto = ServiceMapper.entityToResponseDto;

/**
 * Maps ServiceEntity list to response DTO list.
 * Direction: entities -> response DTO list.
 * @type {(entities: Array<Object>) => Array<Object>}
 */
const toListDto = ServiceMapper.entitiesToListDto;

module.exports = {
  toResponseDto,
  toListDto,
};
