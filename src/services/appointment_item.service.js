/**
 * Service for creating appointment item records linked to appointments.
 */
const AppointmentItemRepository = require("../repositories/appointment_item.repository");
const AppointmentItemDto = require("../dto/appointment_item.dto");
const AppointmentRepository = require("../repositories/appointment.repository");
const serviceRepository = require("../repositories/services.repository");

/**
 * Handles appointment item business logic.
 */
class AppointmentItemService {
  /**
   * Creates one appointment item from request data.
   * Side effects: inserts a row into appointment_items.
   * @param {Object} data
   * @returns {Promise<{ message: string, data: Object|null }>}
   */
  static async createAppointmentItem(data) {
    try {
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

      const item = await AppointmentItemRepository.createAppointmentItem({
        appointment_id,
        service_id,
        appointment_duration_min,
        appointment_price_cents,
      });

      if (!item) {
        throw new Error("create failed ");
      }
      return {
        message: "Appointment item created successfully",
        data: AppointmentItemDto.toResponseDto(item),
      };
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }

  /**
   * Returns one appointment item by id.
   * @param {number|string} appointment_item_id
   * @returns {Promise<Object>}
   * @throws {Error} When the item does not exist.
   */
  static async getAppointmentItemById(appointment_item_id) {
    try {
      const entity =
        await AppointmentItemRepository.findAppointmentItemById(
          appointment_item_id,
        );
      if (!entity) {
        throw new Error("Appointment item not found");
      }
      return AppointmentItemDto.toResponseDto(entity);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }

  /**
   * Returns appointment items for a specific appointment id.
   * @param {number|string} appointment_id
   * @returns {Promise<Array<Object>>}
   * @throws {Error} When the appointment does not exist.
   */
  static async getAppointmentItemsByAppointmentId(appointment_id) {
    try {
      const appointment =
        await AppointmentRepository.findAppointmentById(appointment_id);
      if (!appointment) {
        throw new Error("Appointment not found");
      }
      const entities =
        await AppointmentItemRepository.findAppointmentItemByAppointmentId(
          appointment_id,
        );
      return AppointmentItemDto.entityToListDto(entities);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }

  /**
   * Updates an appointment item when linked appointment and service are valid.
   * Side effects: updates one row in appointment_items.
   * @param {number|string} id
   * @param {Object} data
   * @returns {Promise<{ message: string, data: Object|null }>}
   */
  static async updateAppointmentItem(id, data) {
    try {
      const existingItem =
        await AppointmentItemRepository.findAppointmentItemById(id);
      if (!existingItem) {
        throw new Error("Appointment item not found");
      }
      const appointment = await AppointmentRepository.findAppointmentById(
        existingItem.appointment_id,
      );
      if (!appointment) {
        throw new Error("Linked appointment not found");
      }
      if (
        appointment.appointment_status === "cancelled" ||
        appointment.appointment_status === "completed"
      ) {
        throw new Error(
          "cannot update item of a cancelled or completed appointment",
        );
      }
      const { service_id, appointment_duration_min, appointment_price_cents } =
        AppointmentItemDto.toResponseDto(data);
      const service = await serviceRepository.findServiceById(service_id);
      if (!service) {
        throw new Error("Service not found");
      }
      if (!service.service_is_active) {
        throw new Error("Service is not active");
      }
      const updated = await AppointmentItemRepository.UpdateAppointmentItem(
        id,
        { service_id, appointment_duration_min, appointment_price_cents },
      );
      if (!updated) {
        throw new Error("update failed");
      }
      return {
        message: "Appointment item updated successfully",
        data: AppointmentItemDto.toResponseDto(updated),
      };
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }

  /**
   * Deletes an appointment item when linked appointment allows modifications.
   * Side effects: deletes one row from appointment_items.
   * @param {number|string} id
   * @returns {Promise<{ message: string, data: Object|null }>}
   */
  static async deleteAppointmentItem(id) {
    try {
      const exsistingItem =
        await AppointmentItemRepository.findAppointmentItemById(id);
      if (!exsistingItem) {
        throw new Error("Appointment item not found");
      }
      const appointment = await AppointmentRepository.findAppointmentById(
        existingItem.appointment_id,
      );
      if (!appointment) {
        throw new Error("Linked appointment not found");
      }
      if (
        appointment.appointment_status === "cancelled" ||
        appointment.appointment_status === "completed"
      ) {
        throw new Error(
          "cannot delete item of a cancelled or completed appointment",
        );
      }
      const deleted = await AppointmentItemRepository.deleteAppointmentItem(id);
      if (!deleted) {
        throw new Error("Failed to delete appointment item");
      }
      return {
        message: "Appointment item deleted successfully",
        data: AppointmentItemDto.toResponseDto(deleted),
      };
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }
}
module.exports = AppointmentItemService;
