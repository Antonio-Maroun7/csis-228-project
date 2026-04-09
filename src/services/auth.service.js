const AuthRepository = require("../repositories/auth.repository");
const { generateToken } = require("../utils/token");
const UserDto = require("../dto/user.dto");
const bcrypt = require("bcrypt");

class AuthService {
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
  static async login({ email, password }) {
    try {
      const expectedUser = await AuthRepository.findUserByEmail(email);
      if (!expectedUser) {
        throw new Error("invalid email or password");
      }
      if (!expectedUser.user_is_active) {
        throw new Error("user is not active");
      }
      const isPasswordCorrect = await bcrypt.compare(
        password,
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
