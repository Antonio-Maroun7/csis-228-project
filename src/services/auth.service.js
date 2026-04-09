const AuthRepository = require("../repositories/auth.repository");
const { generateToken } = require("../utils/token");
const UserDto = require("../dto/user.dto");
const bcrypt = require("bcrypt");

class AuthService {
  static async login({ email, password }) {
    try {
      const expectedUser = await AuthRepository.findUserByEmail(email);
      if (!expectedUser) {
        throw new Error("invalid credentials");
      }
      if (!expectedUser.user_is_active) {
        throw new Error("user is not active");
      }
      const isPasswordCorrect = await bcrypt.compare(
        password,
        expectedUser.user_password,
      );
      if (!isPasswordCorrect) {
        throw new Error("invalid credentials");
      }
      const token = generateToken({
        sub: expectedUser.user_id,
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
