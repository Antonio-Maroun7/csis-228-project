const UserService = require("../services/user.service");
class UserController {
  static async getAllUsers(req, res) {
    try {
      const result = await UserService.getAllUsers();
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
  static async getUserBYId(req, res) {
    try {
      const result = await UserService.getUserById(req.params.id);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async createUser(req, res) {
    try {
      const result = await UserService.createUser(req.body);
      res.status(201).json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
module.exports = UserController;
