const UserService = require("../services/user.service");
const { handleError } = require("../utils/errorHandler");
class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (err) {
      return handleError(res, err);
    }
  }
  static async getUserBYId(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      res.json(user);
    } catch (err) {
      return handleError(res, err);
    }
  }

  static async createUser(req, res) {
    try {
      const user = await UserService.getUserByEmail(req.body.user_email);
      if (user) {
        return res.status(409).json({ error: "Email already exists" });
      }
      const createUser = await UserService.createUser(req.body);
      res.status(201).json(createUser);
    } catch (err) {
      return handleError(res, err);
    }
  }
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
  static async getUserBYEmail(req, res) {
    try {
      const result = await UserService.getUserByEmail(req.params.user_email);
      res.json(result);
    } catch (err) {
      return handleError(res, err);
    }
  }
  static async deleteUser(req, res) {
    try {
      const result = await UserService.deleteUser(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      return handleError(res, err);
    }
  }
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
