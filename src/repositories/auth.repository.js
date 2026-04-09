/**
 * Repository for authentication-related user persistence operations.
 */
const pool = require("../db/pool");
const UserEntity = require("../entities/user.entity");
const bcrypt = require("bcrypt");

/**
 * Executes auth-oriented queries against the users table.
 */
class AuthRepository {
  /**
   * Finds a user by email.
   * @param {string} user_email
   * @returns {Promise<UserEntity|null>}
   */
  static async findUserByEmail(user_email) {
    const { rows } = await pool.query(
      `
      SELECT  user_id,
             user_fullname,
             user_email,
             user_password,
             user_role,
             user_phone,
             user_is_active
      FROM users 
      WHERE user_email = $1
     LIMIT 1`,
      [user_email],
    );
    return UserEntity.fromRow(rows[0]);
  }

  /**
   * Creates a user row with hashed password.
   * Side effects: inserts one row into users.
   * @param {{ user_fullname: string, user_email: string, user_password: string, user_role?: string, user_phone?: string|null, user_is_active?: boolean }} param0
   * @returns {Promise<UserEntity|null>}
   */
  static async createUser({
    user_fullname,
    user_email,
    user_password,
    user_role = "client",
    user_phone = null,
    user_is_active = true,
  }) {
    const hashedPassword = await bcrypt.hash(user_password, 10);
    const q = `INSERT INTO users
      (user_fullname,user_email,user_password,
      user_role,user_phone,user_is_active)
      values
      ($1,$2,$3,$4,$5,$6)
       RETURNING user_id,user_fullname,user_email
       ,user_role,user_phone,user_is_active
       `;
    const params = [
      user_fullname,
      user_email,
      hashedPassword,
      user_role,
      user_phone,
      user_is_active,
    ];
    const { rows } = await pool.query(q, params);
    return UserEntity.fromRow(rows[0]);
  }
}
module.exports = AuthRepository;
