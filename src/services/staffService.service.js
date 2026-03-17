const StaffServiceRepository = require("../repositories/staffService.repository");
const staffServiceRepository = require("../repositories/staffService.repository");
const UserRepository = require("../repositories/user.repository");
const createHttpError = require("http-errors");

class StaffServiceService {
  static async assignSerViceToStaff(staff_id, service_id, overrides = {}) {
    const staff = await UserRepository.findUserById(staff_id);
    if (!staff) {
      throw createHttpError(404, "staff not found");
    }

    if (staff.user_role !== "staff") {
      throw createHttpError(400, "this user is not a staff member ");
    }

    return await staffServiceRepository.assignServiceToStaff(
      staff_id,
      service_id,
      overrides,
    );
  }

  static async getStaffServices(staff_id) {
    const staff = await UserRepository.findUserById(staff_id);
    if (!staff) {
      throw new createHttpError(404, "staff not found");
    }

    if (staff.user_role !== "staff") {
      throw new createHttpError(400, "this user is not a staff member");
    }

    return await staffServiceRepository.findStaffServices(staff_id);
  }

  static async getStaffByService(service_id) {
    const staff = await StaffServiceRepository.findStaffByService(service_id);
    if (!staff.length) {
      throw new createHttpError(404, "NO Staff found for this service ");
    }
    return staff;
  }

  static async removeServiceFromStaff(staff_id, service_id) {
    const staff = await UserRepository.findUserById(staff_id);
    if (!staff) {
      throw new createHttpError(404, "staff not found ");
    }
    if (staff.user_role !== "staff") {
      throw new createHttpError(400, "this user is not a staff member");
    }

    //check for the service if exist

    const deleteService = await staffServiceRepository.removeServiceFromStaff(
      staff_id,
      service_id,
    );
    if (!deleteService) {
      throw new createHttpError(
        404,
        "This service is not assigned to this staff member",
      );
    }
    return {
      message: "service deleted successfully from staff",
      data: deleteService,
    };
  }
  static async getAllStaffServices() {
    const result = await staffServiceRepository.findAllStaffServices();
    if (!result.length) {
      throw new createHttpError(404, "nos satff services found ");
    }
    return result;
  }

  static async updateStaffService(staff_id, service_id, overrides = {}) {
    const staff = await UserRepository.findUserById(staff_id);
    if (!staff) {
      throw new createHttpError(404, "staff_id not found");
    }
    if (staff.user_role !== "staff") {
      throw new createHttpError(400, "this user is not a staff member ");
    }

    // check if the service exist

    const updated = await staffServiceRepository.updateStaffServiceOverrides(
      staff_id,
      service_id,
      overrides,
    );
    if (!updated) {
      throw new createHttpError(
        404,
        "this service is not assigned to this staff member ",
      );
    }
    return {
      message: "staff service updated successfully",
      data: updated,
    };
  }
}
module.exports = StaffServiceService;
