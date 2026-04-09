/**
 * Service-domain business logic for salon service records.
 */
const ServiceRepository = require("../repositories/services.repository");
const CategoryRepository = require("../repositories/category.repository");
const ServiceDto = require("../dto/service.dto");

const serviceDto = require("../dto/service.dto");

/**
 * Coordinates service CRUD operations and DTO transformation.
 */
class ServicesService {
  /**
   * Fetches all services.
   * @returns {Promise<Array<Object>>}
   */
  static async getServices() {
    const entities = await ServiceRepository.findServices();
    return ServiceDto.toListDto(entities);
  }

  /**
   * Fetches one service by id.
   * @param {number|string} id
   * @returns {Promise<Object>}
   * @throws {Error} When service is not found.
   */
  static async getServiceById(id) {
    const entity = await ServiceRepository.findServiceById(id);
    if (!entity) {
      throw new Error("Service not found");
    }
    return ServiceDto.toResponseDto(entity);
  }
  /**
   * Creates a new service.
   * Side effects: inserts a row into services.
   * @param {Object} data
   * @returns {Promise<Object|null>}
   */
  static async createService(data) {
    try {
      const entity = await ServiceRepository.createService(data);
      return serviceDto.toResponseDto(entity);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }
  /**
   * Updates an existing service by id.
   * Side effects: updates one services row.
   * @param {number|string} id
   * @param {Object} data
   * @returns {Promise<Object>}
   * @throws {Error} When service is missing or update fails.
   */
  static async updateService(id, data) {
    try {
      const existingService = await ServiceRepository.findServiceById(id);
      if (!existingService) {
        throw new Error("Service not found");
      }
      const updated = await ServiceRepository.updateService(id, data);
      if (!updated) {
        throw new Error("update failed");
      }
      return serviceDto.toResponseDto(updated);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }
  /**
   * Disables a service by id.
   * Side effects: updates service_is_active in services.
   * @param {number|string} id
   * @returns {Promise<Object|null>}
   * @throws {Error} When service is not found.
   */
  static async disableService(id) {
    try {
      const existingService = await ServiceRepository.findServiceById(id);
      if (!existingService) {
        throw new Error("service not found");
      }
      const disabled = await ServiceRepository.disableService(id);
      return ServiceDto.toResponseDto(disabled);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }
  /**
   * Fetches services belonging to a category.
   * @param {number|string} id
   * @returns {Promise<Array<Object>>}
   * @throws {Error} When category is not found.
   */
  static async getServicesByCategory(id) {
    try {
      const existingCategory = await CategoryRepository.getCategoryById(id);
      if (!existingCategory) {
        throw new Error("Category not found");
      }
      const entities = await ServiceRepository.findServicesByCategory(id);
      return ServiceDto.toListDto(entities);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }
}
module.exports = ServicesService;
