const pool = require("../db/pool");
const UserEntity = require("../entities/user.entity");

class AuthRepository {
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
}
module.exports = AuthRepository;
