/**
 * staff_services mapper – dedicated conversions between StaffServices and staff_services DTOs.
 * Single place for all entity ↔ DTO mapping logic.
 *
 */

const staffServicesEntity = require("../entities/staffService.entity");

/**
 * Entity -> response DTO
 * @param {StaffServiceEntity | null} entity
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
 * Entities -> list DTO
 * @param {StaffServiceEntity[]} entities
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
