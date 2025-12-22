const authService = require("../services/authService");

const registerUser = async (req, res) => {
  try {
    const userData = req.body;
    const user = await authService.registerUser(userData);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { emailAddress, password } = req.body;

    const result = await authService.loginUser(emailAddress, password);

    res.status(200).json({
      message: "Login successful",
      token: result.token,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
