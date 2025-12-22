const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { generateAuthToken } = require("../utils/tokenUtils");

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
    });

    return {
      token,
      user: {
        userid: user.userid,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    };
  },
};

module.exports = authService;
