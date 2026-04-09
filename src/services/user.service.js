const UserRepository = require("../repositories/user.repository");
const UserDto = require("../dto/user.dto");
const AuthRepository = require("../repositories/auth.repository");
class UserService {
  static async getAllUsers() {
    const entities = await UserRepository.findAllUsers();
    return UserDto.toListDto(entities);
  }

  static async getUserById(user_id) {
    const entity = await UserRepository.findUserById(user_id);
    if (!entity) {
      throw new Error("User not found");
    }
    return UserDto.toResponseDto(entity);
  }

  static async createUser(data) {
    try {
      const entity = await AuthRepository.createUser(data);
      return UserDto.toResponseDto(entity);
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

    const emailOwner = await AuthRepository.findUserByEmail(data.user_email);
    if (emailOwner && emailOwner.user_id !== user_id) {
      throw new Error("email already exists");
    }
    const updated = await UserRepository.updateUser(user_id, data);
    if (!updated) {
      throw new Error("update failed");
    }
    return UserDto.toResponseDto(updated);
  }

  static async getUserByEmail(user_email) {
    const entity = await AuthRepository.findUserByEmail(user_email);
    return UserDto.toResponseDto(entity);
  }

  static async deleteUser(user_id) {
    const user = await UserRepository.findUserById(user_id);
    if (!user) {
      throw new Error("user not found");
    }
    const entity = await UserRepository.deleteUserById(user_id);
    return {
      message: "User deleted successfully",
      data: UserDto.toResponseDto(entity),
    };
  }

  static async changeUserPassword(user_id, newpassword) {
    const user = await UserRepository.findUserById(user_id);
    if (!user) {
      throw new Error("user not found");
    }
    const entity = await UserRepository.changePasswordByUserId(
      user_id,
      newpassword,
    );
    return { message: "password changed successfully" };
  }
}
module.exports = UserService;
