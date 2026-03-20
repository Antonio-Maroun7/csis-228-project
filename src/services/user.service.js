const UserRepository = require("../repositories/user.repository");

class UserService {
  static async getAllUsers() {
    return await UserRepository.findAllUsers();
  }

  static async getUserById(user_id) {
    const user = await UserRepository.findUserById(user_id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  static async createUser(data) {
    try {
      return await UserRepository.createUser(data);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }

  static async UpdateUser(user_id, data) {
    const existingUser = await UserRepository.findUserById(user_id);
    if (!existingUser) {
      throw new Error("user not found");
    }

    const emailOwner = await UserRepository.findUserByEmail(data.user_email);
    if (emailOwner && emailOwner.user_id !== user_id) {
      throw new Error("email already exists");
    }
    const updated = await UserRepository.updateUser(user_id, data);
    if (!updated) {
      throw new Error("update failed");
    }
    return updated;
  }

  static async getUserByEmail(user_email) {
    return await UserRepository.findUserByEmail(user_email);
  }

  static async deleteUser(user_id) {
    const user = await UserRepository.findUserById(user_id);
    if (!user) {
      throw new Error("user not found");
    }
    await UserRepository.deleteUserById(user_id);
    return "User deleted successfully";
  }

  static async changeUserPassword(user_id, newpassword) {
    const user = await UserRepository.findUserById(user_id);
    if (!user) {
      throw new Error("user not found");
    }
    return await UserRepository.changePasswordByUserId(user_id, newpassword);
  }
}
module.exports = UserService;
