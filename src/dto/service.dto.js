/**
 * service DTOs – API contract (camelCase response/request shapes).
 * All entity ↔ DTO conversion is done in the service mapper.
 */
const ServiceMapper = require("../mappers/service.mapper");

module.exports = {
  toResponseDto: ServiceMapper.entityToResponseDto,
  toListDto: ServiceMapper.entitiesToListDto,
};
