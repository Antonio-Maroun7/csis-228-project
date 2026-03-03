const pool = require("../db/pool");
const { mapUser } = require("../dto/user.dto");

class UserRepository {
  static async findAllUsers() {
    const result = await pool.query(`
        SELECT user_id,user_fullname,user_email,user_role,user_phone,user_is_active 
        FROM users
        ORDER BY user_id DESC`);
    return result.rows.map(mapUser);
  }

  static async findUserById(user_id) {
    const result = await pool.query(
      `SELECT user_id,user_fullname,user_email,user_role,user_phone,user_is_active
      from users
      where user_id = $1`,
      [user_id],
    );
    return result.rows.map(mapUser)[0];
  }

  static async createUser({
    user_fullname,
    user_email,
    user_password,
    user_role = "client",
    user_phone = null,
    user_is_active = true,
  }) {
    const q = `INSERT INTO users
      (user_fullname,user_email,user_password,user_role,user_phone,user_is_active)
      values
      ($1,$2,$3,$4,$5,$6)
       RETURNING user_id,user_fullname,user_email,user_role,user_phone,user_is_active
       `;
    const params = [
      user_fullname,
      user_email,
      user_password,
      user_role,
      user_phone,
      user_is_active,
    ];
    const { rows } = await pool.query(q, params);
    return mapUser(rows[0]);
  }
}
module.exports = UserRepository;
