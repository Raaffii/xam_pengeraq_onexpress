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

const requestPasswordReset = async (req, res) => {
  const { emailAddress } = req.body;

  try {
    await authService.requestPasswordReset(emailAddress);
    return res.status(200).json({
      message:
        "If your email exists, you will receive a verification link shortly",
    });
  } catch (error) {
    if (error.message === "No registered user found with this email") {
      return res.status(404).json({ message: error.message });
    }
    console.error("Error requesting password reset:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    await authService.resetPassword(token, password);
    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error.message);

    if (error.message === "Invalid or expired token") {
      return res.status(401).json({ message: error.message });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  loginUser,
  requestPasswordReset,
  resetPassword,
};
