const UserRepository = require("../repositories/user.repository");
const createHttpError = require("http-errors");

class UserService {
  static async getAllUsers() {
    return await UserRepository.findAllUsers();
  }

  static async getUserById(userIdParam) {
    const user_id = Number(userIdParam);
    if (!Number.isInteger(user_id) || user_id <= 0) {
      throw createHttpError(400, "user_id must be a positive integer");
    }
    const user = await UserRepository.findUserById(user_id);
    if (!user) {
      if (!user) throw createHttpError(404, "User not found");
    }
    return user;
  }

  static async createUser(data) {
    if (
      !data.user_fullname ||
      !data.user_email ||
      !data.user_password ||
      !data.user_role ||
      !data.user_phone ||
      !data.user_is_active
    ) {
      throw new createHttpError(
        400,
        `Missing required fields: user_fullname, user_email, user_password,
         user_role, user_phone, user_is_active`,
      );
    }
    return await UserRepository.createUser(data);
  }
}
module.exports = UserService;
