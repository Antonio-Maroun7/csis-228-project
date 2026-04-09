/**
 * User service for user retrieval, updates, deletion, and password management.
 */
const UserRepository = require("../repositories/user.repository");
const UserDto = require("../dto/user.dto");
const AuthRepository = require("../repositories/auth.repository");
/**
 * Encapsulates user business logic over repository operations.
 */
class UserService {
  /**
   * Fetches all users and maps them to response DTOs.
   * @returns {Promise<Array<Object>>}
   */
  static async getAllUsers() {
    const entities = await UserRepository.findAllUsers();
    return UserDto.toListDto(entities);
  }

  /**
   * Fetches a single user by id.
   * @param {number|string} user_id
   * @returns {Promise<Object>}
   * @throws {Error} When user is not found.
   */
  static async getUserById(user_id) {
    const entity = await UserRepository.findUserById(user_id);
    if (!entity) {
      throw new Error("User not found");
    }
    return UserDto.toResponseDto(entity);
  }

  /**
   * Updates a user after existence and email ownership checks.
   * Side effects: writes updates to the users table.
   * @param {number|string} user_id
   * @param {Object} data
   * @returns {Promise<Object>}
   * @throws {Error} When user is missing, email is already used, or update fails.
   */
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

  /**
   * Fetches a user by email.
   * @param {string} user_email
   * @returns {Promise<Object|null>}
   */
  static async getUserByEmail(user_email) {
    const entity = await AuthRepository.findUserByEmail(user_email);
    return UserDto.toResponseDto(entity);
  }

  /**
   * Deletes a user by id.
   * Side effects: removes one user row from the database.
   * @param {number|string} user_id
   * @returns {Promise<{ message: string, data: Object|null }>}
   * @throws {Error} When user is not found.
   */
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

  /**
   * Changes a user's password.
   * Side effects: updates password hash in the database.
   * @param {number|string} user_id
   * @param {string} newpassword
   * @returns {Promise<{ message: string }>}
   * @throws {Error} When user is not found.
   */
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
