const ServicesService = require("../services/services.service");
const { handleError } = require("../utils/errorHandler");
class ServiceController {
  static async getAllServices(req, res) {
    try {
      const services = await ServicesService.getServices();
      res.json(services);
    } catch (err) {
      return handleError(res, err);
    }
  }
}
module.exports = ServiceController;
