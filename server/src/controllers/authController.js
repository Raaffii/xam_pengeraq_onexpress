const authService = require("../services/authService");

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
        role: result.user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  loginUser,
};
