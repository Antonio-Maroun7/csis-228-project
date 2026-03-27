/**
 * User mapper – dedicated conversions between UserEntity and User DTOs.
 * Single place for all entity ↔ DTO mapping logic.
 */

const UserEntity = require("../entities/user.entity");

/**
 * Entity → response DTO (single user).
 * @param {UserEntity | null} entity
 * @returns {{ id: number, fullname: string,
 *  email: string,password:string,role:string,
 * phone:string,user_is_active:boolean } | null}
 */
function entityToResponseDto(entity) {
  if (!entity) return null;
  return {
    id: entity.user_id,
    fullname: entity.user_fullname,
    email: entity.user_email,
    password: entity.user_password,
    role: entity.user_role,
    phone: entity.user_phone,
    is_active: entity.user_is_active,
  };
}
