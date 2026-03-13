const UserRepository = require("../repositories/user.repository");
const createHttpError = require("http-errors");

class UserService {
  static async getAllUsers() {
    return await UserRepository.findAllUsers();
  }

  static async getUserById(user_id) {
    try {
      const user = await UserRepository.findUserById(user_id);
      if (!user) {
        if (!user) throw createHttpError(404, "User not found");
      }
      return user;
    } catch (e) {
      console.log(e.message);
    }
  }

  static async createUser(data) {
    try {
      return await UserRepository.createUser(data);
    } catch (e) {
      console.log(e.message);
    }
  }

  static async UpdateUser(userIdParam, data) {
    const user_id = Number(userIdParam);
    if (!Number.isInteger(user_id) || user_id <= 0) {
      throw new createHttpError(400, "user_id must bea positive integer");
    }
    if (
      data.user_fullname === undefined ||
      data.user_email === undefined ||
      data.user_role === undefined ||
      data.user_phone === undefined ||
      data.user_is_active === undefined
    ) {
      throw new createHttpError(
        400,
        `Missing required fields: user_fullname, user_email, 
      user_role, user_phone, user_is_active`,
      );
    }
    const existingUser = await UserRepository.findUserById(user_id);
    if (!existingUser) {
      throw new createHttpError(404, "user not found");
    }
    return await UserRepository.updateUser(user_id, data);
  }

  static async getUserByEmail(user_email) {
    if (!user_email) {
      throw new createHttpError(400, `user_email is required`);
    }

    const user = await UserRepository.findUserByEmail(user_email);
    if (!user) {
      return null;
    }
    return user;
  }

  static async deleteUser(userIdParam) {
    const user_id = Number(userIdParam);
    if (!Number.isInteger(user_id) || user_id <= 0) {
      throw new createHttpError(400, "user_id must be a positive integer");
    }
    const user = await UserRepository.findUserById(user_id);
    if (!user) {
      throw new createHttpError(404, "user not found");
    }
    await UserRepository.deleteUserById(user_id);
    return "User deleted successfully";
  }

  static async changeUserPassword(userIdParam, newPassword) {
    const user_id = Number(userIdParam);
    if (!Number.isInteger(user_id) || user_id <= 0) {
      throw new createHttpError(400, "user_id must be a positive integer");
    }
    const user = await UserRepository.findUserById(user_id);
    if (!user) {
      throw new createHttpError(404, "user not found");
    }
    return await UserRepository.changePasswordByUserId(user_id, newPassword);
  }
}
module.exports = UserService;
