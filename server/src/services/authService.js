const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { generateAuthToken } = require("../utils/tokenUtils");
const emailService = require("./emailService");
const pool = require("../config/db");

const authService = {
  async registerUser(userData) {
    const { name, email, password, phone } = userData;
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = await User.createUser({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    return {
      userid: userId,
      name,
      email,
      phone,
    };
  },
  async loginUser(email, password) {
    const user = await User.findUserByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = generateAuthToken({
      userId: user.userid,
      userName: user.name,
      email: user.email,
      role: user.role,
      teacherId: user.teacherid,
    });

    return {
      token,
      user: {
        userid: user.userid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  },
  async requestPasswordReset(email) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const user = await User.findUserByEmail(email);
      if (!user) {
        throw new Error("No registered user found with this email");
      }

      const { token } = await User.createOrUpdatePasswordResetToken(
        connection,
        user.userid,
      );

      await emailService.sendResetEmail(user.email, user.name, token);

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      console.error("Error in request Password Reset:", error);
      throw error;
    } finally {
      connection.release();
    }
  },
  async resetPassword(token, password) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const resetRecord = await User.verifyResetToken(connection, token);
      if (!resetRecord) {
        throw new Error("Invalid or expired token");
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      await User.resetUserPasswordAndClearToken(
        connection,
        resetRecord.userId,
        hashedPassword,
      );

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      console.error("Error in resetPassword:", error);
      throw error;
    } finally {
      connection.release();
    }
  },
};

module.exports = authService;
