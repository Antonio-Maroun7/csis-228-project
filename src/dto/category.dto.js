/**
 * Category DTOs – API contract (camelCase response/request shapes).
 * All entity ↔ DTO conversion is done in the category mapper.
 */
const CategoryMapper = require("../mappers/category.mapper");
module.exports = {
  entityToResponseDto: CategoryMapper.entityToResponseDto,
  entityToListDto: CategoryMapper.entityToListDto,
};
