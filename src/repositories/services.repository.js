const pool = require("../db/pool");

class Services {
  static async getServices() {
    const { rows } = await pool.query(`SELECT *
    FROM services 
    ORDER By service_id`);
  }
}
