/**
 * User DTOs – API contract (camelCase response/request shapes).
 * All entity ↔ DTO conversion is done in the client mapper.
 */

const UserMapper = require("../mappers/user.mapper");

/**
 * Maps internal UserEntity to public response DTO.
 * Direction: entity -> response DTO.
 * @type {(entity: Object|null) => Object|null}
 */
const toResponseDto = UserMapper.entityToResponseDto;

/**
 * Maps a list of UserEntity values to response DTO list.
 * Direction: entities -> response DTO list.
 * @type {(entities: Array<Object>) => Array<Object>}
 */
const toListDto = UserMapper.entitiesToListDto;

module.exports = {
  toResponseDto,
  toListDto,
};
