const AuthRepository = require("../repositories/auth.repository");
const { generateToken } = require("../utils/token");

class AuthService {
  static async login({ email, password }) {
    const expectedUser = await AuthRepository.authenticate(email, password);
    if (!expectedUser) {
      throw new Error("Invalid Credentials");
    }
    if (!expectedUser.user_is_active) {
      throw new Error("user is not active");
    }
    const token = generateToken({ sub: email });

    return {
      token,
    };
  }
}
module.exports = AuthService;
