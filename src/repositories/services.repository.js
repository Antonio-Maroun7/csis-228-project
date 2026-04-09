/**
 * Repository for services table persistence and lookups.
 */
const pool = require("../db/pool");
const ServiceEntity = require("../entities/service.entity");

/**
 * Executes service-related SQL queries.
 */
class ServicesRepository {
  /**
   * Returns all services ordered by id.
   * @returns {Promise<ServiceEntity[]>}
   */
  static async findServices() {
    const { rows } = await pool.query(`SELECT *
    FROM services 
    ORDER By service_id`);
    return ServiceEntity.fromRows(rows);
  }

  /**
   * Returns services associated with one category.
   * @param {number|string} category_id
   * @returns {Promise<ServiceEntity[]>}
   */
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

  /**
   * Finds one service by id.
   * @param {number|string} id
   * @returns {Promise<ServiceEntity|null>}
   */
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

  /**
   * Creates a service row.
   * Side effects: inserts one row into services.
   * @param {{ category_id: number, service_name: string, service_description?: string|null, service_default_duration_min: number, service_base_price_cents: number, service_is_active?: boolean }} param0
   * @returns {Promise<ServiceEntity|null>}
   */
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
  /**
   * Updates one service row by id.
   * Side effects: updates one services row.
   * @param {number|string} service_id
   * @param {{ category_id: number, service_name: string, service_description?: string|null, service_default_duration_min: number, service_base_price_cents: number, service_is_active?: boolean }} param1
   * @returns {Promise<ServiceEntity|null>}
   */
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

  /**
   * Disables a service by id.
   * Side effects: updates service_is_active to false.
   * @param {number|string} service_id
   * @returns {Promise<ServiceEntity|null>}
   */
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
