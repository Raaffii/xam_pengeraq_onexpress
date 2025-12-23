const { verifyAuthToken } = require("../utils/tokenUtils");

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const decoded = verifyAuthToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token expired",
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(403).json({
      success: false,
      message: "Invalid access token",
      code: "INVALID_TOKEN",
    });
  }
};

const authRole = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
        code: "PERMISSION_DENIED",
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authRole,
};
