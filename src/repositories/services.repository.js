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
}
module.exports = ServicesRepository;
