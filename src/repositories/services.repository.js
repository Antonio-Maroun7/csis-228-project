const pool = require("../db/pool");
const ServiceEntity = require("../entities/service.entity");

class ServicesRepository {
  static async findServices() {
    const { rows } = await pool.query(`SELECT *
    FROM services 
    ORDER By service_id`);
    return ServiceEntity.fromRows(rows);
  }

  static async findServicesByCategory(category_id) {
    const q = `
    SELECT *
    FROM services
    WHERE category_id =$1
    ORDER BY service_id `;
    const params = [category_id];
    const { rows } = await pool.query(q, params);
    return ServiceEntity.fromRows(rows);
  }

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
  static async updateService(
    service_id,
    {
      category_id,
      service_name,
      service_description,
      service_default_duration_min,
      service_base_price_cents,
      service_is_active,
    },
  ) {
    const q = `UPDATE services 
    SET category_id=$1,
         service_name=$2,
         service_description=$3,
         service_default_duration_min=$4,
         service_base_price_cents=$5,
         service_is_active=$6
    WHERE service_id = $7 
    RETURNING service_id, category_id, 
              service_name, service_description,
              service_default_duration_min, service_base_price_cents, 
              service_is_active
    `;
    const params = [
      category_id,
      service_name,
      service_description,
      service_default_duration_min,
      service_base_price_cents,
      service_is_active,
      service_id,
    ];
    const { rows } = await pool.query(q, params);
    return ServiceEntity.fromRow(rows[0]);
  }

  static async disableService(service_id) {
    const q = `
    UPDATE services
    SET service_is_active= false
    WHERE service_id = $1
    RETURNING service_id, category_id, 
              service_name, service_description,
              service_default_duration_min, service_base_price_cents, 
              service_is_active`;
    const params = [service_id];
    const { rows } = await pool.query(q, params);
    return ServiceEntity.fromRow(rows[0]);
  }
}
module.exports = ServicesRepository;
