/**
 * Category mapper – dedicated conversions between CategoryEntity and category DTOs.
 * Single place for all entity ↔ DTO mapping logic.
 */
const CategoryEntity = require("../entities/category.entity");

/**
 * Converts one category entity to response DTO.
 * Direction: entity -> response DTO.
 * @param {CategoryEntity | null} entity
 * @returns {{
 *   id: number,
 *   name: string,
 *   description: string | null,
 *   is_active: boolean
 * } | null}
 */
const entityToResponseDto = (entity) => {
  if (!entity) return null;
  return {
    id: entity.category_id,
    name: entity.category_name,
    description: entity.category_description,
    is_active: entity.category_is_active,
  };
};

/**
 * Converts category entities to response DTO list.
 * Direction: entities -> response DTO list.
 * @param {CategoryEntity[]} entities
 * @returns {{
 *   id: number,
 *   name: string,
 *   description: string | null,
 *   is_active: boolean
 * }[]}
 */
const entityToListDto = (entities) => {
  return (entities || []).map(entityToResponseDto);
};
module.exports = { entityToResponseDto, entityToListDto };
