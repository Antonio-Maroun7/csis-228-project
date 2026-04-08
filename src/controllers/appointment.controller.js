const AppointmentService = require("../services/appointment.service");
const { handleError } = require("../utils/errorHandler");

class AppointmentController {
  static async createAppointment(req, res) {
    try {
      const appointment = await AppointmentService.createAppointment(req.body);
      res.status(201).json(appointment);
    } catch (err) {
      return handleError(res, err);
    }
  }
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
}
module.exports = AppointmentController;
