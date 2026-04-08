const AuthService = require("../services/auth.service");
const { handleError } = require("../utils/errorHandler");

class AuthController {
  static async login(req, res) {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json(result);
    } catch (err) {
      return handleError(res, err);
    }
  }
}
module.exports = AuthController;
