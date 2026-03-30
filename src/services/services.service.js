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
}
module.exports = ServicesService;
