/**
 * DTO for appointment date-range query results joined with client user data.
 * Converts raw database rows into API-friendly nested objects.
 */
class AppointmentWithClientDto {
  /**
   * Maps one appointment-with-client entity into API response shape.
   * @param {Object|undefined|null} entity
   * @returns {{
   *   appointment_id: number,
   *   client_id: number,
   *   staff_id: number,
   *   appointment_start_at: string|Date|null,
   *   appointment_ends_at: string|Date|null,
   *   appointment_status: string,
   *   appointment_notes: string|null,
   *   appointment_created_at: string|Date|null,
   *   client: {
   *     fullname: string,
   *     email: string,
   *     role: string,
   *     phone: string|null,
   *     is_active: boolean
   *   }
   * }|null}
   */
  static toResponseDto(entity) {
    if (!entity) return null;

    return {
      appointment_id: entity.appointment_id,
      client_id: entity.client_id,
      staff_id: entity.staff_id,
      appointment_start_at: entity.appointment_start_at,
      appointment_ends_at: entity.appointment_ends_at,
      appointment_status: entity.appointment_status,
      appointment_notes: entity.appointment_notes,
      appointment_created_at: entity.appointment_created_at,
      client: {
        fullname: entity.client_fullname,
        email: entity.client_email,
        role: entity.client_role,
        phone: entity.client_phone,
        is_active: entity.client_is_active,
      },
    };
  }

  /**
   * Maps appointment-with-client entities into API response list shape.
   * @param {Array<Object>} entities
   * @returns {Array<Object>}
   */
  static toListDto(entities) {
    return (entities || []).map((entity) =>
      AppointmentWithClientDto.toResponseDto(entity),
    );
  }

  /**
   * Backward-compatible alias for list mapping.
   * @param {Array<Object>} rows
   * @returns {Array<Object>}
   */
  static fromRows(rows) {
    return AppointmentWithClientDto.toListDto(rows);
  }
}

module.exports = AppointmentWithClientDto;
