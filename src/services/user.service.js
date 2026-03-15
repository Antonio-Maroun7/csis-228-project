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

  static async UpdateUser(user_id, data) {
    const existingUser = await UserRepository.findUserById(user_id);
    if (!existingUser) {
      throw new createHttpError(404, "user not found");
    }

    const emailOwner = await UserRepository.findUserByEmail(data.user_email);
    if (emailOwner && emailOwner.user_id !== user_id) {
      throw new createHttpError(409, "email already exists");
    }
    const updated = await UserRepository.updateUser(user_id, data);
    if (!updated) {
      throw new createHttpError(400, "user was not updated");
    }
    return updated;
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
