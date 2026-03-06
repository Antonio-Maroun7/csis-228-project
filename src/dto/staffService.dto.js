const mapStaffService = (row) => {
  if (!row) return null;
  return {
    staff_id: row.staff_id,
    service_id: row.service_id,
    staff_duration_min: row.staff_duration_min,
    staff_price_cents: row.staff_price_cents,
  };
};

module.exports = { mapStaffService };
