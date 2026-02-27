const pool = require("../db/pool");

class UserRepository {
  static async findAllUsers() {
    const result = await pool.query(`
        SELECT user_id,user_fullname,user_email,user_role,user_phone,user_is_active 
        FROM users
        ORDER BY user_id DESC`);
    return result.rows;
  }
}
