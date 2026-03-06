const pool = require("../db/pool");
const { mapStaffService } = require("../dto/staffService.dto");

class StaffServiceRepository {
  static async assignServiceToStaff(staff_id, service_id, overrides = {}) {
    const { staff_duration_min = null, staff_price_cents = null } = overrides;
    const q = `INSERT INTO staff_services
      (staff_id,service_id,staff_duration_min,staff_price_cents)
      VALUES($1,$2,$3,$4)
      RETURNING *`;
    const params = [
      staff_id,
      service_id,
      staff_duration_min,
      staff_price_cents,
    ];
    const { rows } = await pool.query(q, params);
    return mapStaffService(rows[0]);
  }

  static async getStaffServices(staff_id) {
    const q = `SELECT *
    FROM staff_services 
    WHERE staff_id = $1
    ORDER BY service_id`;
    const params = [staff_id];
    const { rows } = await pool.query(q, params);
    return rows.map(mapStaffService);
  }
}

module.exports = StaffServiceRepository;
