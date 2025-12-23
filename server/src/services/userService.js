const UserModel = require("../models/userModel");

const userService = {
  async getAllUsers(options = {}) {
    return await UserModel.findAll(options);
  },
};

module.exports = userService;
