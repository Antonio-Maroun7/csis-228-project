/**
 * User DTOs – API contract (camelCase response/request shapes).
 * All entity ↔ DTO conversion is done in the client mapper.
 */

const UserMapper = require("../mappers/user.mapper");

module.exports = {
  toResponseDto: UserMapper.entityToResponseDto,
  toListsDto: UserMapper.entitiesToListDto,
};
