const AppointmentItemRepository = require("../repositories/appointment_item.repository");
const AppointmentItemDto = require("../dto/appointment_item.dto");
const AppointmentRepository = require("../repositories/appointment.repository");
const serviceRepository = require("../repositories/services.repository");

class AppointmentItemService {
  static async createAppointmentItem(data) {
    const {
      appointment_id,
      service_id,
      appointment_duration_min,
      appointment_price_cents,
    } = AppointmentItemDto.toCreateRequest(data);
    const appointment =
      await AppointmentRepository.findAppointmentById(appointment_id);
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    const service = await serviceRepository.findServiceById(service_id);
    if (!service) {
      throw new Error("Service not found ");
    }
    if (
      appointment.appointment_status === "cancelled" ||
      appointment.appointment_status === "completed"
    ) {
      throw new Error(
        "cannot add item to a cancelled or completed appointment",
      );
    }
    if (!service.service_is_active) {
      throw new Error("Service is not active");
    }

    const item = await AppointmentItemRepository.createAppointmentItem(
      appointment_id,
      service_id,
      appointment_duration_min,
      appointment_price_cents,
    );

    if (!item) {
      throw new Error("create failed ");
    }
    return {
      message: "Appointment item created successfully",
      data: AppointmentItemDto.toResponseDto(item),
    };
  }
}
module.exports = AppointmentItemService;
