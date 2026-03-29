const pool = require("../db/pool");

const bycrypt = require("bcrypt");
const UserEntity = require("../entities/user.entity");
const userDto = require("../dto/user.dto");

class UserRepository {
  static async findAllUsers() {
    const result = await pool.query(`
        SELECT user_id,user_fullname,user_email,user_role,user_phone,user_is_active 
        FROM users
        ORDER BY user_id DESC`);
    return UserEntity.fromRows(result.rows);
  }

  static async findUserById(user_id) {
    const result = await pool.query(
      `SELECT user_id,user_fullname,user_email,user_role,user_phone,user_is_active
      from users
      where user_id = $1`,
      [user_id],
    );
    return UserEntity.fromRow(result.rows[0]);
  }

  static async createUser({
    user_fullname,
    user_email,
    user_password,
    user_role = "client",
    user_phone = null,
    user_is_active = true,
  }) {
    const hashedPassword = await bycrypt.hash(user_password, 10);
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
  static async findUserByEmail(user_email) {
    const { rows } = await pool.query(
      `
      SELECT  user_id,
             user_fullname,
             user_email,
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
  }
}
module.exports = UserRepository;
