const AppointmentItemService = require("../services/appointment_item.service");
const { handleError } = require("../utils/errorHandler");

class AppointmentItemController {
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
}
module.exports = AppointmentItemController;
