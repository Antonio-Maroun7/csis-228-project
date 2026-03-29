const ServiceRepository = require("../repositories/services.repository");
const ServiceDto = require("../dto/service.dto");

class ServicesService {
  static async getServices() {
    const entities = await ServiceRepository.findServices();
    return ServiceDto.toListDto(entities);
  }
}
module.exports = ServicesService;
