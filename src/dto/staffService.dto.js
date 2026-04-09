/**
 * StaffService DTOs – API contract (camelCase response/request shapes).
 * All entity ↔ DTO conversion is done in the StaffService mapper.
 */

const StaffServiceMapper = require("../mappers/staffService.mapper");

/**
 * Maps one StaffServiceEntity to response DTO.
 * Direction: entity -> response DTO.
 * @type {(entity: Object|null) => Object|null}
 */
const toResponseDto = StaffServiceMapper.entityToResponseDto;

/**
 * Maps staff-service entities to response DTO list.
 * Direction: entities -> response DTO list.
 * @type {(entities: Array<Object>) => Array<Object>}
 */
const toListDto = StaffServiceMapper.entitiesToListDto;

module.exports = {
  toResponseDto,
  toListDto,
};
