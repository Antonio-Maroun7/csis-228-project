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
  static async getServiceById(req, res) {
    try {
      const service = await ServicesService.getServiceById(req.params.id);
      res.json(service);
    } catch (err) {
      return handleError(res, err);
    }
  }
  static async createService(req, res) {
    try {
      const service = await ServicesService.createService(req.body);
      res.status(201).json(service);
    } catch (err) {
      return handleError(res, err);
    }
  }

  static async updateService(req, res) {
    try {
      const service = await ServicesService.updateService(
        req.params.id,
        req.body,
      );
      res
        .status(200)
        .json({ message: "Sevice updated successfully", data: service });
    } catch (err) {
      return handleError(res, err);
    }
  }
}
module.exports = ServiceController;
