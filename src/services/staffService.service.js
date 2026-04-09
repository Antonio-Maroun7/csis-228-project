/**
 * Service layer for assigning, querying, and updating staff service overrides.
 */
const StaffServiceRepository = require("../repositories/staffService.repository");
const UserRepository = require("../repositories/user.repository");
const StaffServiceDto = require("../dto/staffService.dto");
const ServiceRepository = require("../repositories/services.repository");
const userDto = require("../dto/user.dto");

/**
 * Coordinates staff/service assignment business rules.
 */
class StaffServiceService {
  /**
   * Assigns a service to a staff member with optional overrides.
   * Side effects: inserts a row into staff_services.
   * @param {number|string} staff_id
   * @param {number|string} service_id
   * @param {{ staff_duration_min?: number|null, staff_price_cents?: number|null }} [overrides]
   * @returns {Promise<Object|null>}
   */
  static async assignServiceToStaff(staff_id, service_id, overrides = {}) {
    const staff = await UserRepository.findUserById(staff_id);
    if (!staff) {
      throw Error("staff not found");
    }

    if (staff.user_role !== "staff") {
      throw Error("this user is not a staff member ");
    }
    const service = await ServiceRepository.findServiceById(service_id);
    if (!service) {
      throw new Error("service not found ");
    }

    const entity = await StaffServiceRepository.assignServiceToStaff(
      staff_id,
      service_id,
      overrides,
    );
    return StaffServiceDto.toResponseDto(entity);
  }

  /**
   * Returns services assigned to a staff member.
   * @param {number|string} staff_id
   * @returns {Promise<Array<Object>>}
   */
  static async getStaffServices(staff_id) {
    const staff = await UserRepository.findUserById(staff_id);
    if (!staff) {
      throw new Error("staff not found");
    }

    if (staff.user_role !== "staff") {
      throw new Error("this user is not a staff member");
    }

    const entities = await StaffServiceRepository.findStaffServices(staff_id);
    return StaffServiceDto.toListDto(entities);
  }

  /**
   * Returns staff users that can perform a given service.
   * @param {number|string} service_id
   * @returns {Promise<Array<Object>>}
   */
  static async getStaffByService(service_id) {
    const service = await ServiceRepository.findServiceById(service_id);
    if (!service) {
      throw new Error("service not found ");
    }
    const staff = await StaffServiceRepository.findStaffByService(service_id);
    if (!staff.length) {
      throw new Error("staff not found for this service ");
    }
    return userDto.toListDto(staff);
  }

  /**
   * Removes a service assignment from a staff member.
   * Side effects: deletes one row from staff_services.
   * @param {number|string} staff_id
   * @param {number|string} service_id
   * @returns {Promise<{ message: string, data: Object|null }>}
   */
  static async removeServiceFromStaff(staff_id, service_id) {
    const staff = await UserRepository.findUserById(staff_id);
    if (!staff) {
      throw new Error("staff not found ");
    }
    if (staff.user_role !== "staff") {
      throw new Error("this user is not a staff member");
    }

    const service = await ServiceRepository.findServiceById(service_id);
    if (!service) {
      throw new Error("service not found ");
    }

    const deleteService = await StaffServiceRepository.removeServiceFromStaff(
      staff_id,
      service_id,
    );
    if (!deleteService) {
      throw new Error("This service is not assigned to this staff member");
    }
    return {
      message: "service deleted successfully from staff",
      data: StaffServiceDto.toResponseDto(deleteService),
    };
  }
  /**
   * Returns all staff-service assignments.
   * @returns {Promise<Array<Object>>}
   */
  static async getAllStaffServices() {
    const entities = await StaffServiceRepository.findAllStaffServices();
    if (!entities.length) {
      throw new Error("no staff services found ");
    }
    return StaffServiceDto.toListDto(entities);
  }

  /**
   * Updates override fields for a staff-service pair.
   * Side effects: updates one row in staff_services.
   * @param {number|string} staff_id
   * @param {number|string} service_id
   * @param {{ staff_duration_min?: number|null, staff_price_cents?: number|null }} [overrides]
   * @returns {Promise<{ message: string, data: Object|null }>}
   */
  static async updateStaffService(staff_id, service_id, overrides = {}) {
    const staff = await UserRepository.findUserById(staff_id);
    if (!staff) {
      throw new Error("staff_id not found");
    }
    if (staff.user_role !== "staff") {
      throw new Error("this user is not a staff member ");
    }

    const service = await ServiceRepository.findServiceById(service_id);
    if (!service) {
      throw new Error("service not found ");
    }

    const updated = await StaffServiceRepository.updateStaffServiceOverrides(
      staff_id,
      service_id,
      overrides,
    );
    if (!updated) {
      throw new Error("this service is not assigned to this staff member ");
    }
    return {
      message: "staff service updated successfully",
      data: StaffServiceDto.toResponseDto(updated),
    };
  }
}
module.exports = StaffServiceService;
