/**
 * Users entity - represents the users row from the database.
 * Uses DB column names (snake_case).
 */

class UserEntity {
  /**
   * Creates a user entity using database column naming.
   * @param {{ user_id?: number, user_fullname?: string, user_email?: string, user_password?: string, user_role?: string, user_phone?: string|null, user_is_active?: boolean }} [param0]
   */
  constructor({
    user_id,
    user_fullname,
    user_email,
    user_password,
    user_role,
    user_phone,
    user_is_active,
  } = {}) {
    this.user_id = user_id;
    this.user_fullname = user_fullname;
    this.user_email = user_email;
    this.user_password = user_password;
    this.user_role = user_role;
    this.user_phone = user_phone;
    this.user_is_active = user_is_active;
  }
  /**
   * Builds an entity instance from one DB row.
   * @param {Object|undefined|null} row
   * @returns {UserEntity|null}
   */
  static fromRow(row) {
    if (!row) return null;
    return new UserEntity(row);
  }

  /**
   * Builds a list of entity instances from DB rows.
   * @param {Array<Object>} rows
   * @returns {UserEntity[]}
   */
  static fromRows(rows) {
    return (rows || []).map((row) => UserEntity.fromRow(row));
  }
}
module.exports = UserEntity;
