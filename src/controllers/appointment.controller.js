const AppointmentService = require("../services/appointment.service");
const { handleError } = require("../utils/errorHandler");

class AppointmentController {
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
}
module.exports = AppointmentController;
