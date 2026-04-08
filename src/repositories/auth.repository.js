const pool = require("../db/pool");
const UserEntity = require("../entities/user.entity");

class AuthRepository {
  static async authenticate(email, password) {
    const q = `
        SELECT *
        FROM users 
        WHERE user_email =$1
        AND user_password=$2`;
    const params = [email, password];
    const { rows } = await pool.query(q, params);
    return UserEntity.fromRow(rows[0]);
  }
}
module.exports = AuthRepository;
