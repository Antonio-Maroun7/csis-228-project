const staffServiceService = require("../services/staffService.service");
const { handleError } = require("../utils/errorHandler");

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
    } catch (err) {
      return handleError(res, err);
    }
  }

  static async getStaffServices(req, res) {
    try {
      const { staff_id } = req.params;
      const result = await staffServiceService.getStaffServices(staff_id);
      res.json(result);
    } catch (e) {
      res.status(e.status || 500).json({ error: e.message });
    }
  }
  static async getStaffByService(req, res) {
    try {
      const { service_id } = req.params;
      const result = await staffServiceService.getStaffByService(service_id);
      res.json(result);
    } catch (e) {
      res.status(e.status || 500).json({ error: e.message });
    }
  }

  static async deleteServiceFromStaff(req, res) {
    try {
      const { staff_id, service_id } = req.body;
      const result = await staffServiceService.removeServiceFromStaff(
        staff_id,
        service_id,
      );
      res.status(200).json(result);
    } catch (e) {
      res.status(e.status || 500).json({ error: e.message });
    }
  }
  static async getAllStaffServices(req, res) {
    try {
      const result = await staffServiceService.getAllStaffServices();
      res.json(result);
    } catch (e) {
      res.status(e.status || 500).json({ error: e.message });
    }
  }
  static async updateStaffServices(req, res) {
    try {
      const { staff_id, service_id, staff_duration_min, staff_price_cents } =
        req.body;
      const result = await staffServiceService.updateStaffService(
        staff_id,
        service_id,
        {
          staff_duration_min,
          staff_price_cents,
        },
      );
      res.status(200).json(result);
    } catch (e) {
      res.status(e.status || 500).json({ error: e.message });
    }
  }
}
module.exports = StaffServiceController;
