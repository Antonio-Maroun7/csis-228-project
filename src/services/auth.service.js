const AuthRepository = require("../repositories/auth.repository");
const { generateToken } = require("../utils/token");
const UserDto = require("../dto/user.dto");

class AuthService {
  static async login({ email, password }) {
    const expectedUser = await AuthRepository.authenticate(email, password);
    if (!expectedUser) {
      throw new Error("Invalid Credentials");
    }
    if (!expectedUser.user_is_active) {
      throw new Error("user is not active");
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
  }
}
module.exports = AuthService;
