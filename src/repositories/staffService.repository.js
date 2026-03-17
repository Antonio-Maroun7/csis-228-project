const pool = require("../db/pool");
const { mapStaffService } = require("../dto/staffService.dto");
const { mapUser } = require("../dto/user.dto");

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

  static async findStaffServices(staff_id) {
    const q = `SELECT *
    FROM staff_services 
    WHERE staff_id = $1
    ORDER BY service_id`;
    const params = [staff_id];
    const { rows } = await pool.query(q, params);
    return rows.map(mapStaffService);
  }

  static async findStaffByService(service_id) {
    const q = `SELECT u.user_id,u.user_fullname,u.user_email,u.user_phone
    FROM staff_services s 
    join users u on u.user_id = s.staff_id 
    WHERE s.service_id = $1
    AND u.user_role = 'staff'
    ORDER BY u.user_fullname`;
    const params = [service_id];
    const { rows } = await pool.query(q, params);
    return rows.map(mapUser);
  }

  static async removeServiceFromStaff(staff_id, service_id) {
    const q = `DELETE 
    FROM staff_services
    WHERE staff_id = $1 AND service_id = $2
    RETURNING *`;
    const params = [staff_id, service_id];
    const { rows } = await pool.query(q, params);
    return rows[0] ? mapStaffService(rows[0]) : null;
  }

  static async findAllStaffServices() {
    const { rows } = await pool.query(`SELECT *
    FROM staff_services
    ORDER BY service_id,staff_id`);
    return rows.map(mapStaffService);
  }

  static async updateStaffServiceOverrides(
    staff_id,
    service_id,
    overrides = {},
  ) {
    const { staff_duration_min = null, staff_price_cents = null } = overrides;
    const q = `UPDATE staff_services
              SET staff_duration_min=COALESCE($1, staff_duration_min),
              staff_price_cents=COALESCE($2, staff_price_cents)
              WHERE staff_id =$3 AND service_id =$4
              RETURNING *`;
    const params = [
      staff_duration_min,
      staff_price_cents,
      staff_id,
      service_id,
    ];

    const { rows } = await pool.query(q, params);
    return rows[0] ? mapStaffService(rows[0]) : null;
  }
}

module.exports = StaffServiceRepository;
