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

  static async createService({
    category_id,
    service_name,
    service_description,
    service_default_duration_min,
    service_base_price_cents,
    service_is_active,
  }) {
    const q = `INSERT INTO services
    (category_id,service_name,
    service_description,service_default_duration_min,
    service_base_price_cents,service_is_active)
    values($1,$2,$3,$4,$5,$6)
    RETURNING service_id, category_id, 
    service_name, service_description,
    service_default_duration_min, service_base_price_cents, 
    service_is_active`;
    const params = [
      category_id,
      service_name,
      service_description,
      service_default_duration_min,
      service_base_price_cents,
      service_is_active,
    ];
    const { rows } = await pool.query(q, params);
    return ServiceEntity.fromRow(rows[0]);
  }
}
module.exports = ServicesRepository;
