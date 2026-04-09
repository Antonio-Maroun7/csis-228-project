/**
 * Authentication service for registering users and issuing login tokens.
 */
const AuthRepository = require("../repositories/auth.repository");
const { generateToken } = require("../utils/token");
const UserDto = require("../dto/user.dto");
const bcrypt = require("bcrypt");

/**
 * Coordinates authentication-related business rules.
 */
class AuthService {
  /**
   * Registers a new user and generates an auth token.
   * Side effects: writes a user record to the database and hashes password through repository.
   * @param {Object} data
   * @returns {Promise<{ message: string, data: Object, token: string }>}
   * @throws {Error} When email already exists or creation fails.
   */
  static async register(data) {
    try {
      const {
        user_fullname,
        user_email,
        user_password,
        user_role = "client",
        user_is_active = true,
      } = data;
      const existingUser = await AuthRepository.findUserByEmail(user_email);
      if (existingUser) {
        throw new Error("user already exist");
      }
      const user = await AuthRepository.createUser({
        user_fullname,
        user_email,
        user_password,
        user_role,
        user_is_active,
      });
      if (!user) {
        throw new Error("create failed");
      }
      const token = generateToken({
        id: user.user_id,
        email: user.user_email,
        role: user.user_role,
      });
      return {
        message: "User registered successfully",
        data: UserDto.toResponseDto(user),
        token,
      };
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }
  /**
   * Authenticates a user and returns an auth token.
   * Side effects: compares password hash and generates signed token.
   * @param {{ user_email: string, user_password: string }} param0
   * @returns {Promise<{ message: string, token: string, data: Object }>}
   * @throws {Error} When credentials are invalid or the user is inactive.
   */
  static async login({ user_email, user_password }) {
    try {
      const expectedUser = await AuthRepository.findUserByEmail(user_email);
      if (!expectedUser) {
        throw new Error("invalid email or password");
      }
      if (!expectedUser.user_is_active) {
        throw new Error("user is not active");
      }
      const isPasswordCorrect = await bcrypt.compare(
        user_password,
        expectedUser.user_password,
      );
      if (!isPasswordCorrect) {
        throw new Error("invalid email or password");
      }
      const token = generateToken({
        id: expectedUser.user_id,
        email: expectedUser.user_email,
        role: expectedUser.user_role,
      });

      return {
        message: "login successful",
        token,
        data: UserDto.toResponseDto(expectedUser),
      };
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }
}
module.exports = AuthService;
