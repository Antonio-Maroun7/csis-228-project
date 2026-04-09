/**
 * Authentication controller for login and registration endpoints.
 */
const AuthService = require("../services/auth.service");
const { handleError } = require("../utils/errorHandler");

/**
 * Handles authentication HTTP requests.
 */
class AuthController {
  /**
   * Authenticates a user using credentials from req.body.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async login(req, res) {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json(result);
    } catch (err) {
      return handleError(res, err);
    }
  }
  /**
   * Registers a new user using payload from req.body.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async register(req, res) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      return handleError(res, err);
    }
  }
}
module.exports = AuthController;
