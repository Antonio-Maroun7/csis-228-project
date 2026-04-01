const ServiceRepository = require("../repositories/services.repository");
const ServiceDto = require("../dto/service.dto");

const serviceDto = require("../dto/service.dto");

class ServicesService {
  static async getServices() {
    const entities = await ServiceRepository.findServices();
    return ServiceDto.toListDto(entities);
  }

  static async getServiceById(id) {
    const entity = await ServiceRepository.findServiceById(id);
    if (!entity) {
      throw new Error("Service not found");
    }
    return ServiceDto.toResponseDto(entity);
  }
  static async createService(data) {
    try {
      const entity = await ServiceRepository.createService(data);
      return serviceDto.toResponseDto(entity);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }
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
  static async deleteService(id) {}
}
module.exports = ServicesService;
