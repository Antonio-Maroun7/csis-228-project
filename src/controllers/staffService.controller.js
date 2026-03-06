const staffServiceService = require("../services/staffService.service");

class StaffServiceController {
  static async assignServiceToStaff(req, res) {
    try {
      const { staff_id, service_id } = req.body;
      const overrides = {
        staff_duration_min: req.body.staff_duration_min,
        staff_price_cents: req.body.staff_price_cents,
      };
      const result = await staffServiceService.assignSerViceToStaff(
        staff_id,
        service_id,
        overrides,
      );
      res.status(201).json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async getStaffServices(req, res) {
    try {
      const { staff_id } = req.params;
      const result = await staffServiceService.getStaffServices(staff_id);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
module.exports = StaffServiceController;
