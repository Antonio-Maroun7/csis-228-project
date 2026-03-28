const StaffServiceRepository = require("../repositories/staffService.repository");
const UserRepository = require("../repositories/user.repository");
const StaffServiceDto = require("../dto/staffService.dto");

class StaffServiceService {
  static async assignSerViceToStaff(staff_id, service_id, overrides = {}) {
    const staff = await UserRepository.findUserById(staff_id);
    if (!staff) {
      throw Error("staff not found");
    }

    if (staff.user_role !== "staff") {
      throw Error("this user is not a staff member ");
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

    return await StaffServiceRepository.findStaffServices(staff_id);
  }

  static async getStaffByService(service_id) {
    const staff = await StaffServiceRepository.findStaffByService(service_id);
    if (!staff.length) {
      throw new Error("staff not found for this service ");
    }
    return staff;
  }

  static async removeServiceFromStaff(staff_id, service_id) {
    const staff = await UserRepository.findUserById(staff_id);
    if (!staff) {
      throw new Error("staff not found ");
    }
    if (staff.user_role !== "staff") {
      throw new Error("this user is not a staff member");
    }

    //check for the service if exist

    const deleteService = await StaffServiceRepository.removeServiceFromStaff(
      staff_id,
      service_id,
    );
    if (!deleteService) {
      throw new Error("This service is not assigned to this staff member");
    }
    return {
      message: "service deleted successfully from staff",
      data: deleteService,
    };
  }
  static async getAllStaffServices() {
    const result = await StaffServiceRepository.findAllStaffServices();
    if (!result.length) {
      throw new Error("no staff services found ");
    }
    return result;
  }

  static async updateStaffService(staff_id, service_id, overrides = {}) {
    const staff = await UserRepository.findUserById(staff_id);
    if (!staff) {
      throw new Error("staff_id not found");
    }
    if (staff.user_role !== "staff") {
      throw new Error("this user is not a staff member ");
    }

    // check if the service exist

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
      data: updated,
    };
  }
}
module.exports = StaffServiceService;
