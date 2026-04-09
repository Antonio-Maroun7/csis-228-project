/**
 * Category DTOs – API contract (camelCase response/request shapes).
 * All entity ↔ DTO conversion is done in the category mapper.
 */
const CategoryMapper = require("../mappers/category.mapper");

/**
 * Maps one CategoryEntity to response DTO.
 * Direction: entity -> response DTO.
 * @type {(entity: Object|null) => Object|null}
 */
const toResponseDto = CategoryMapper.entityToResponseDto;

/**
 * Maps CategoryEntity list to response DTO list.
 * Direction: entities -> response DTO list.
 * @type {(entities: Array<Object>) => Array<Object>}
 */
const toListDto = CategoryMapper.entityToListDto;

module.exports = {
  toResponseDto,
  toListDto,
};
