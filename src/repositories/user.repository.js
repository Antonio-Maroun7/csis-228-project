/**
 * Repository for users table CRUD operations.
 */
const pool = require("../db/pool");

const bycrypt = require("bcrypt");
const UserEntity = require("../entities/user.entity");
const userDto = require("../dto/user.dto");

/**
 * Runs user persistence queries and maps rows into UserEntity.
 */
class UserRepository {
  /**
   * Returns all users ordered by descending id.
   * @returns {Promise<UserEntity[]>}
   */
  static async findAllUsers() {
    const result = await pool.query(`
        SELECT user_id,user_fullname,user_email,user_role,user_phone,user_is_active 
        FROM users
        ORDER BY user_id DESC`);
    return UserEntity.fromRows(result.rows);
  }

  /**
   * Finds a user by primary key.
   * @param {number|string} user_id
   * @returns {Promise<UserEntity|null>}
   */
  static async findUserById(user_id) {
    const result = await pool.query(
      `SELECT user_id,user_fullname,user_email,user_role,user_phone,user_is_active
      from users
      where user_id = $1`,
      [user_id],
    );
    return UserEntity.fromRow(result.rows[0]);
  }

  /**
   * Updates one user record.
   * Side effects: updates a row in users.
   * @param {number|string} user_id
   * @param {{ user_fullname: string, user_email: string, user_role: string, user_phone: string|null, user_is_active: boolean }} param1
   * @returns {Promise<UserEntity|null>}
   */
  static async updateUser(
    user_id,
    { user_fullname, user_email, user_role, user_phone, user_is_active },
  ) {
    const q = `UPDATE users 
       SET user_fullname = $1,user_email =$2,
        user_role =$3,
       user_phone = $4, user_is_active = $5
       WHERE user_id = $6
       RETURNING user_id,user_fullname,user_email
       ,user_role,user_phone,user_is_active
       `;
    const params = [
      user_fullname,
      user_email,
      user_role,
      user_phone,
      user_is_active,
      user_id,
    ];

    const { rows } = await pool.query(q, params);
    return UserEntity.fromRow(rows[0]);
  }

  /**
   * Deletes one user record by id.
   * Side effects: deletes a row from users.
   * @param {number|string} user_id
   * @returns {Promise<UserEntity|null>}
   */
  static async deleteUserById(user_id) {
    const { rows } = await pool.query(
      `DELETE 
      FROM users 
      WHERE user_id = $1
      RETURNING user_id, user_fullname, 
      user_email, user_role, user_phone, user_is_active`,
      [user_id],
    );
    return rows[0] ? UserEntity.fromRow(rows[0]) : null;
  }
  /**
   * Updates password hash for a user.
   * Side effects: updates user_password in users.
   * @param {number|string} user_id
   * @param {string} newpassword
   * @returns {Promise<UserEntity|null>}
   */
  static async changePasswordByUserId(user_id, newpassword) {
    const hashedPassword = await bycrypt.hash(newpassword, 10);
    const q = `UPDATE users 
    SET user_password = $1
    WHERE user_id = $2
    RETURNING user_id,user_fullname,user_email,
    user_role,user_phone,user_is_active
    `;
    const params = [hashedPassword, user_id];
    const { rows } = await pool.query(q, params);
    return UserEntity.fromRow(rows[0]);
  }
}
module.exports = UserRepository;
