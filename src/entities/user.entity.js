/**
 * Users entity - represents the users row from the database.
 * Uses DB column names (snake_case).
 */

class UserEntity {
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
  static fromRow(row) {
    if (!row) return null;
    return new UserEntity(row);
  }

  static fromRows(rows) {
    return (rows || []).map((row) => UserEntity.fromRow(row));
  }
}
module.exports = UserEntity;
