/**
 * Controller for staff-to-service assignment endpoints.
 */
const staffServiceService = require("../services/staffService.service");
const { handleError } = require("../utils/errorHandler");

/**
 * Handles staff service assignment and lookup HTTP requests.
 */
class StaffServiceController {
  /**
   * Assigns a service to a staff member using req.body data.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async assignServiceToStaff(req, res) {
    try {
      const { staff_id, service_id } = req.body;
      const overrides = {
        staff_duration_min: req.body.staff_duration_min,
        staff_price_cents: req.body.staff_price_cents,
      };
      const result = await staffServiceService.assignServiceToStaff(
        staff_id,
        service_id,
        overrides,
      );
      res.status(201).json(result);
    } catch (err) {
      return handleError(res, err);
    }
  }

  /**
   * Returns services assigned to the staff member in req.params.staff_id.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async getStaffServices(req, res) {
    try {
      const { staff_id } = req.params;
      const result = await staffServiceService.getStaffServices(staff_id);
      res.json(result);
    } catch (err) {
      return handleError(res, err);
    }
  }

  /**
   * Returns staff members associated with req.params.service_id.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async getStaffByService(req, res) {
    try {
      const { service_id } = req.params;
      const result = await staffServiceService.getStaffByService(service_id);
      res.json(result);
    } catch (err) {
      return handleError(res, err);
    }
  }

  /**
   * Removes a service assignment from staff using req.body identifiers.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async deleteServiceFromStaff(req, res) {
    try {
      const { staff_id, service_id } = req.body;
      const result = await staffServiceService.removeServiceFromStaff(
        staff_id,
        service_id,
      );
      res.status(200).json(result);
    } catch (err) {
      return handleError(res, err);
    }
  }
  /**
   * Returns all staff-service assignments.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async getAllStaffServices(req, res) {
    try {
      const result = await staffServiceService.getAllStaffServices();
      res.json(result);
    } catch (err) {
      return handleError(res, err);
    }
  }
  /**
   * Updates staff-specific overrides for duration and/or price using req.body.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
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
    } catch (err) {
      return handleError(res, err);
    }
  }
}
module.exports = StaffServiceController;
