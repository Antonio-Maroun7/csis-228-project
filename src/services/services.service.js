const ServiceRepository = require("../repositories/services.repository");
const ServiceDto = require("../dto/service.dto");

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
}
module.exports = ServicesService;
