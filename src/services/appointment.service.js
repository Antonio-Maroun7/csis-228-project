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
  static async createAppointment(appointmentData) {
    const { client_id, staff_id, starts_at, service_items, appointment_notes } =
      AppointmentDto.fromCreateRequest(appointmentData);

    const client = await UserRepository.findUserById(client_id);
    if (!client) {
      throw new Error("Client not found");
    }

    if (!service_items || !service_items.length ) {
      throw new Error("At least one service item must be provided");
    }
  }
}

module.exports = AppointmentService;
