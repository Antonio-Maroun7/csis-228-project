/**
 * User controller for user management endpoints.
 */
const UserService = require("../services/user.service");
const { handleError } = require("../utils/errorHandler");
/**
 * Handles user-related Express request/response interactions.
 */
class UserController {
  /**
   * Returns all users.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (err) {
      return handleError(res, err);
    }
  }
  /**
   * Returns a user by id from req.params.id.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async getUserBYId(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      res.json(user);
    } catch (err) {
      return handleError(res, err);
    }
  }

  /**
   * Updates a user by id using req.params.id and req.body.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async UpdateUser(req, res) {
    try {
      const updateUser = await UserService.UpdateUser(req.params.id, req.body);
      res
        .status(200)
        .json({ message: "User updated successfully", data: updateUser });
    } catch (err) {
      return handleError(res, err);
    }
  }
  /**
   * Returns a user by email from req.params.user_email.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async getUserBYEmail(req, res) {
    try {
      const result = await UserService.getUserByEmail(req.params.user_email);
      res.json(result);
    } catch (err) {
      return handleError(res, err);
    }
  }
  /**
   * Deletes a user by id from req.params.id.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async deleteUser(req, res) {
    try {
      const result = await UserService.deleteUser(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      return handleError(res, err);
    }
  }
  /**
   * Changes user password using req.params.id and req.body.newpassword.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  static async changeUserPassword(req, res) {
    try {
      const { newpassword } = req.body;
      const result = await UserService.changeUserPassword(
        req.params.id,
        newpassword,
      );
      res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
      return handleError(res, err);
    }
  }
}
module.exports = UserController;
