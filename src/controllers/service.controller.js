/**
 * Service controller for service management endpoints.
 */
const ServicesService = require("../services/services.service");
const { handleError } = require("../utils/errorHandler");
/**
 * Handles service-related HTTP request logic.
 */
class ServiceController {
  /**
   * Returns all services.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async getAllServices(req, res) {
    try {
      const services = await ServicesService.getServices();
      res.json(services);
    } catch (err) {
      return handleError(res, err);
    }
  }
  /**
   * Returns one service by req.params.id.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async getServiceById(req, res) {
    try {
      const service = await ServicesService.getServiceById(req.params.id);
      res.json(service);
    } catch (err) {
      return handleError(res, err);
    }
  }
  /**
   * Creates a service from req.body.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async createService(req, res) {
    try {
      const service = await ServicesService.createService(req.body);
      res.status(201).json(service);
    } catch (err) {
      return handleError(res, err);
    }
  }

  /**
   * Updates a service by req.params.id using req.body.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
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
  /**
   * Disables a service identified by req.params.id.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async disabledService(req, res) {
    try {
      const disabledService = await ServicesService.disableService(
        req.params.id,
      );
      res.status(200).json({
        message: "service disabled successfully",
        data: disabledService,
      });
    } catch (err) {
      return handleError(res, err);
    }
  }
  /**
   * Returns services that belong to the category in req.params.id.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async getServicesByCategory(req, res) {
    try {
      const services = await ServicesService.getServicesByCategory(
        req.params.id,
      );
      res.json(services);
    } catch (err) {
      return handleError(res, err);
    }
  }
}
module.exports = ServiceController;
