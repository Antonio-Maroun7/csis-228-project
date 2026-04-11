/**
 * Controller for appointment item endpoints.
 */
const AppointmentItemService = require("../services/appointment_item.service");
const { handleError } = require("../utils/errorHandler");

/**
 * Handles appointment item request/response operations.
 */
class AppointmentItemController {
  /**
   * Creates an appointment item from req.body.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async createAppointment(req, res) {
    try {
      const result = await AppointmentItemService.createAppointmentItem(
        req.body,
      );
      res.status(201).json(result);
    } catch (err) {
      return handleError(res, err);
    }
  }

  /**
   * Returns a single appointment item using req.params.id.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async getAppointmentItemById(req, res) {
    try {
      const result = await AppointmentItemService.getAppointmentItemById(
        req.params.id,
      );
      res.json(result);
    } catch (err) {
      return handleError(res, err);
    }
  }

  /**
   * Returns appointment items for one appointment using req.params.id.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async getAppointmentItemsByAppointmentId(req, res) {
    try {
      const result =
        await AppointmentItemService.getAppointmentItemsByAppointmentId(
          req.params.id,
        );
      res.json(result);
    } catch (err) {
      return handleError(res, err);
    }
  }

  /**
   * Updates an appointment item using req.params.id and req.body.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async updateAppointmentItem(req, res) {
    try {
      const result = await AppointmentItemService.updateAppointmentItem(
        req.params.id,
        req.body,
      );
      return res.status(200).json(result);
    } catch (err) {
      return handleError(res, err);
    }
  }

  /**
   * Deletes an appointment item using req.params.id.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async deleteAppointmentItem(req, res) {
    try {
      const result = await AppointmentItemService.deleteAppointmentItem(
        req.params.id,
      );
      return res.status(200).json(result);
    } catch (err) {
      return handleError(res, err);
    }
  }
}
module.exports = AppointmentItemController;
