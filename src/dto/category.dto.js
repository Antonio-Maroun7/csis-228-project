/**
 * Category DTOs – API contract.
 * All entity ↔ DTO conversion is done in the category mapper.
 */

const CategoryMapper = require("../mappers/category.mapper");

/**
 * Maps one CategoryEntity to response DTO.
 * Direction: entity -> response DTO.
 */
const toResponseDto = CategoryMapper.entityToResponseDto;

/**
 * Maps CategoryEntity list to response DTO list.
 * Direction: entities -> response DTO list.
 */
const toListDto = CategoryMapper.entityToListDto;

module.exports = {
  toResponseDto,
  toListDto,
};
