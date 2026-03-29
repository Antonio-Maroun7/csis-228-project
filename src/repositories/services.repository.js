const pool = require("../db/pool");
const ServiceEntity = require("../entities/service.entity");
const ServiceDto = require("../dto/service.dto");

class ServicesRepository {
  static async findServices() {
    const { rows } = await pool.query(`SELECT *
    FROM services 
    ORDER By service_id`);
    return ServiceEntity.fromRows(rows);
  }

  //	getServicesByCategory(categoryId)

  static async findServiceById(id) {
    const { rows } = await pool.query(
      `
      SELECT *
      from services
      WHERE service_id = $1`,
      [id],
    );
    return ServiceEntity.fromRow(rows[0]);
  }
}
module.exports = ServicesRepository;
