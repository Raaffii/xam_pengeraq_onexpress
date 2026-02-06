const pool = require("../config/db");
const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

const userService = {
  async getAllUsers(options = {}) {
    return await UserModel.findAll(options);
  },

  async createUser(data) {
    const {
      userName,
      emailAddress,
      password,
      role,
      enteredBy,
      studentId,
      teacherId,
    } = data;
    const existingUser = await UserModel.findUserByEmail(emailAddress);
    if (existingUser && existingUser.active === 1) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await UserModel.createUser({
      userName,
      emailAddress,
      hashedPassword,
      role,
      enteredBy,
      studentId,
      teacherId,
    });

    return this.fetchUserDetails(userId);
  },

  async updateUser(data) {
    let userData = data;

    if (data.emailAddress) {
      const existingUser = await UserModel.findUserByEmail(data.emailAddress);

      if (
        existingUser &&
        existingUser.active === 1 &&
        existingUser.userid !== data.userId
      ) {
        throw new Error("Email already exists");
      }
    }

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      userData = { ...userData, hashedPassword };
    }

    const result = await UserModel.updateUser(userData);

    if (!result) {
      throw new Error("User not found");
    }

    return this.fetchUserDetails(data.userId);
  },

  async deleteUser(data) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const user = await UserModel.fetchUserById(data.userToDelete);
      if (!user) {
        throw new Error("User not found");
      }
      await UserModel.softDeleteUser(conn, data);
      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },

  async fetchUserDetails(userId) {
    const user = await UserModel.fetchUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },

  async resetPassword(userId, newPassword) {
    const user = await UserModel.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await UserModel.updateUser({
      userId,
      hashedPassword: hashedNewPassword,
      editedBy: userId,
    });

    return true;
  },

  async teacherIdToNull(teacherId) {
    try {
      const user = await UserModel.teacherIdToNull(teacherId);
      return user;
    } catch (err) {
      throw err;
    }
  },

  async changePassword(userId, currentPassword, newPassword) {
    const user = await UserModel.findUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await UserModel.updateUser({
      userId,
      hashedPassword: hashedNewPassword,
      editedBy: userId,
    });

    return true;
  },
};

module.exports = userService;
