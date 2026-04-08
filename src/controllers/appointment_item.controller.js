const AppointmentItemService = require("../services/appointment_item.service");
const { handleError } = require("../utils/errorHandler");

class AppointmentItemController {
  static async createAppointment(req, res) {
    try {
    } catch (err) {
      return handleError(res, err);
    }
  }
}
module.exports = AppointmentItemController;
