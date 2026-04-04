const AppointmentRepository = require("../repositories/appointment.repository");
const AppointmentDto = require("../dto/appointment.dto");
const UserRepository = require("../repositories/user.repository");

class AppointmentService {
  static async getAppoitmentsByClient_id(client_id) {
    const client = await UserRepository.findUserById(client_id);
    if (!client) {
      throw new Error("Client not found");
    }
    const entities =
      await AppointmentRepository.findAppointmentsByClient(client_id);
    return AppointmentDto.toListDto(entities);
  }
}
module.exports = AppointmentService;
