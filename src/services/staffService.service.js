const StaffServiceRepository = require("../repositories/staffService.repository");
const UserRepository = require("../repositories/user.repository");
const StaffServiceDto = require("../dto/staffService.dto");
const ServiceRepository = require("../repositories/services.repository");
const userDto = require("../dto/user.dto");

class StaffServiceService {
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
  static async getAllStaffServices() {
    const entities = await StaffServiceRepository.findAllStaffServices();
    if (!entities.length) {
      throw new Error("no staff services found ");
    }
    return StaffServiceDto.toListDto(entities);
  }

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
