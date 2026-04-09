/**
 * staff_services mapper – dedicated conversions between StaffServices and staff_services DTOs.
 * Single place for all entity ↔ DTO mapping logic.
 *
 */

const staffServicesEntity = require("../entities/staffService.entity");

/**
 * Converts one staff-service entity to API response DTO.
 * Direction: entity -> response DTO.
 * @param {staffServicesEntity | null} entity
 * @returns {{
 *   staff_id: number,
 *   service_id: number,
 *   staff_duration_min: number | null,
 *   staff_price_cents: number | null
 * } | null}
 */

const entityToResponseDto = (entity) => {
  if (!entity) return null;

  return {
    staff_id: entity.staff_id,
    service_id: entity.service_id,
    duration_min: entity.staff_duration_min,
    price_cents: entity.staff_price_cents,
  };
};

/**
 * Converts staff-service entities to list DTO.
 * Direction: entities -> response DTO list.
 * @param {staffServicesEntity[]} entities
 * @returns {{
 *   staff_id: number,
 *   service_id: number,
 *   staff_duration_min: number | null,
 *   staff_price_cents: number | null
 * }[]}
 */
const entitiesToListDto = (entities) => {
  return (entities || []).map(entityToResponseDto);
};

module.exports = { entityToResponseDto, entitiesToListDto };
