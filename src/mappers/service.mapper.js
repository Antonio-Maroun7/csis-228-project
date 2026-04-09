/**
 * Service mapper – dedicated conversions between ServiceEntity and service DTOs.
 * Single place for all entity ↔ DTO mapping logic.
 */
const serviceEntity = require("../entities/service.entity");

/**
 * Converts one service entity to API response shape.
 * Direction: entity -> response DTO.
 * @param {serviceEntity | null} entity
 * @returns {{
 *   id: number,
 *   category_id: number,
 *   name: string,
 *   description: string | null,
 *   default_duration_min: number,
 *   base_price_cents: number,
 *   is_active: boolean
 * } | null}
 */

const entityToResponseDto = (entity) => {
  if (!entity) return null;
  return {
    id: entity.service_id,
    category_id: entity.category_id,
    name: entity.service_name,
    description: entity.service_description,
    default_duration_min: entity.service_default_duration_min,
    base_price_cents: entity.service_base_price_cents,
    is_active: entity.service_is_active,
  };
};

/**
 * Converts service entities to list response shape.
 * Direction: entities -> response DTO list.
 * @param {serviceEntity[]} entities
 * @returns {{
 *   id: number,
 *   category_id: number,
 *   name: string,
 *   description: string | null,
 *   default_duration_min: number,
 *   base_price_cents: number,
 *   is_active: boolean
 * }[]}
 */
const entitiesToListDto = (entities) => {
  return (entities || []).map(entityToResponseDto);
};

module.exports = { entityToResponseDto, entitiesToListDto };
