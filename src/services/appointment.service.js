const AppointmentRepository = require("../repositories/appointment.repository");
const AppointmentDto = require("../dto/appointment.dto");
const UserRepository = require("../repositories/user.repository");

class AppointmentService {
  static async createAppointment(appointmentData) {
    const { client_id, staff_id, starts_at, service_items, appointment_notes } =
      AppointmentDto.fromCreateRequest(appointmentData);

    const client = await UserRepository.findUserById(client_id);
    if (!client) {
      throw new Error("Client not found");
    }

    if (!service_items || !service_items.length) {
      throw new Error("At least one service item must be provided");
    }
  }
  static async getAppoitmentsByClient_id(client_id) {
    const client = await UserRepository.findUserById(client_id);
    if (!client) {
      throw new Error("Client not found");
    }
    if (client.user_role !== "client") {
      throw new Error("User is not a client");
    }

    const entities =
      await AppointmentRepository.findAppointmentsByClient(client_id);
    if (!entities || entities.length === 0) {
      throw new Error("Appointments for this client not found");
    }
    return AppointmentDto.toListDto(entities);
  }

  static async getAppointmentsByStaff_id(staff_id) {
    try {
      const staff = await UserRepository.findUserById(staff_id);
      if (!staff) {
        throw new Error("Staff not found");
      }
      if (staff.user_role !== "staff") {
        throw new Error("User is not a staff member");
      }

      const entities =
        await AppointmentRepository.findAppointmentsByStaff(staff_id);
      if (!entities || entities.length === 0) {
        throw new Error(" appointments for this staff member not found");
      }
      return AppointmentDto.toListDto(entities);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }
  static async getAppointmentById(appointment_id) {
    try {
      const entity =
        await AppointmentRepository.findAppointmentById(appointment_id);
      if (!entity) {
        throw new Error("Appointment not found");
      }
      return AppointmentDto.toResponseDto(entity);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }

  static async updateAppointment(appointment_id, status) {
    try {
      const appointment =
        await AppointmentRepository.findAppointmentById(appointment_id);
      if (!appointment) {
        throw new Error("Appointment not found");
      }
      const allowedStatuses = [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
        "no_show",
      ];
      if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid appointment status");
      }
      const updatedAppointment =
        await AppointmentRepository.updateAppointmentStatus(
          appointment_id,
          status,
        );
      if (!updatedAppointment) {
        throw new Error("update failed");
      }
      return {
        message: "Appointment status updated successfully",
        data: AppointmentDto.toResponseDto(updatedAppointment),
      };
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }

  static async cancelAppointment(appointment_id) {
    try {
      const appointment =
        await AppointmentRepository.findAppointmentById(appointment_id);
      if (!appointment) {
        throw new Error("Appointment not found");
      }
      if (appointment.appointment_status === "cancelled") {
        throw new Error("Appointment is already cancelled");
      }
      const cancelled = await AppointmentRepository.updateAppointmentStatus(
        appointment_id,
        "cancelled",
      );
      if (!cancelled) {
        throw new Error("update failed");
      }
      return {
        message: "Appointment cancelled successfully",
        data: AppointmentDto.toResponseDto(cancelled),
      };
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }
}

module.exports = AppointmentService;
