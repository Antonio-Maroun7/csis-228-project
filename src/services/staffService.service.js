const StaffServiceRepository = require("../repositories/staffService.repository");
const staffServiceRepository = require("../repositories/staffService.repository");
const UserRepository = require("../repositories/user.repository");
const createHttpError = require("http-errors");

class StaffServiceService {
  static async assignSerViceToStaff(
    staff_idParam,
    service_idParam,
    overrides = {},
  ) {
    const staff_id = Number(staff_idParam);
    const service_id = Number(service_idParam);

    if (!Number.isInteger(staff_id) || staff_id <= 0) {
      throw createHttpError(400, "staff_id must be a positive integer");
    }

    const staff = await UserRepository.findUserById(staff_id);
    if (!staff) {
      throw createHttpError(404, "staff not found");
    }

    if (staff.user_role !== "staff") {
      throw createHttpError(400, "this user is not a staff member ");
    }

    if (!Number.isInteger(service_id) || service_id <= 0) {
      throw createHttpError(400, "service_id must be a positive integer");
    }

    return await staffServiceRepository.assignServiceToStaff(
      staff_id,
      service_id,
      overrides,
    );
  }

  static async getStaffServices(staffIdParam) {
    const staff_id = Number(staffIdParam);
    if (!Number.isInteger(staff_id) || staff_id <= 0) {
      throw new createHttpError(400, "staff id must be a positive integer");
    }

    const staff = await UserRepository.findUserById(staff_id);
    if (!staff) {
      throw new createHttpError(404, "staff not found");
    }

    if (staff.user_role !== "staff") {
      throw new createHttpError(400, "this user is not a staff member");
    }

    return await staffServiceRepository.findStaffServices(staff_id);
  }

  static async getStaffByService(serviceIdParam) {
    const service_id = Number(serviceIdParam);
    if (!Number.isInteger(service_id) || service_id <= 0) {
      throw new createHttpError(400, "service id must be a positive integer");
    }

    const staff = await StaffServiceRepository.findStaffByService(service_id);
    if (!staff.length) {
      throw new createHttpError(404, "NO Staff found for this service ");
    }
    return staff;
  }

  static async removeServiceFromStaff(staffIdPram, serviceIdParam) {
    const staff_id = Number(staffIdPram);
    const service_id = Number(serviceIdParam);

    if (!Number.isInteger(staff_id) || staff_id <= 0) {
      throw new createHttpError(400, "staff_id must be a positive integer");
    }

    if (!Number.isInteger(service_id) || service_id <= 0) {
      throw new createHttpError(400, "service_id must be a positive integer");
    }

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
}
module.exports = StaffServiceService;
