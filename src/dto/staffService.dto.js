/**
 * StaffService DTOs – API contract (camelCase response/request shapes).
 * All entity ↔ DTO conversion is done in the StaffService mapper.
 */

const StaffServiceMapper = require("../mappers/staffService.mapper");

module.exports = {
  toResponseDto: StaffServiceMapper.entityToResponseDto,
  toListDto: StaffServiceMapper.entitiesToListDto,
};
