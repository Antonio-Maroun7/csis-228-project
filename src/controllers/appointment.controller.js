/**
 * Controller for appointment lifecycle and availability endpoints.
 */
const AppointmentService = require("../services/appointment.service");
const { handleError } = require("../utils/errorHandler");

/**
 * Handles appointment-related HTTP requests.
 */
class AppointmentController {
  /**
   * Creates an appointment from req.body payload.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async createAppointment(req, res) {
    try {
      const appointment = await AppointmentService.createAppointment(req.body);
      res.status(201).json(appointment);
    } catch (err) {
      return handleError(res, err);
    }
  }
  /**
   * Returns appointments for the client id in req.params.id.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async getAppointmentsByClient(req, res) {
    try {
      const appointments = await AppointmentService.getAppoitmentsByClient_id(
        req.params.id,
      );
      res.json(appointments);
    } catch (err) {
      return handleError(res, err);
    }
  }

  /**
   * Returns appointments for the staff id in req.params.id.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async getAppointmentsByStaff(req, res) {
    try {
      const appointments = await AppointmentService.getAppointmentsByStaff_id(
        req.params.id,
      );
      res.json(appointments);
    } catch (err) {
      return handleError(res, err);
    }
  }
  /**
   * Returns one appointment by req.params.id.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async getAppointmentById(req, res) {
    try {
      const appointment = await AppointmentService.getAppointmentById(
        req.params.id,
      );
      res.json(appointment);
    } catch (err) {
      return handleError(res, err);
    }
  }
  /**
   * Updates appointment status using req.params.id and req.body.status.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async UpdateAppointmentStatus(req, res) {
    try {
      const { status } = req.body;
      const updateAppointment =
        await AppointmentService.updateAppointmentStatus(req.params.id, status);
      res.status(200).json(updateAppointment);
    } catch (err) {
      return handleError(res, err);
    }
  }
  /**
   * Cancels an appointment identified by req.params.id.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async cancelAppointment(req, res) {
    try {
      const cancelAppointment = await AppointmentService.cancelAppointment(
        req.params.id,
      );
      res.status(200).json(cancelAppointment);
    } catch (err) {
      return handleError(res, err);
    }
  }
  /**
   * Updates appointment details using req.params.id and req.body.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async updateAppointment(req, res) {
    try {
      const appointment = await AppointmentService.updateAppointmentDetails(
        req.params.id,
        req.body,
      );
      res.status(200).json(appointment);
    } catch (err) {
      return handleError(res, err);
    }
  }
  /**
   * Checks staff scheduling conflicts using request body date range and staff_id.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async checkAppointmentConflict(req, res) {
    try {
      const conflict = await AppointmentService.checkStaffAvailability(
        req.body,
      );
      res.status(200).json(conflict);
    } catch (err) {
      return handleError(res, err);
    }
  }

  /**
   * Retrieves appointments between date boundaries from request body.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async getAppointmentsBetweenDates(req, res) {
    try {
      const start_date = req.body?.start_date ?? req.query?.start_date;
      const end_date = req.body?.end_date ?? req.query?.end_date;
      const result = await AppointmentService.getAppointmentBetweenDates(
        start_date,
        end_date,
      );
      return res.status(200).json({
        message: "Appointments retrieved successfully",
        data: result,
      });
    } catch (err) {
      return handleError(res, err);
    }
  }
}
module.exports = AppointmentController;
