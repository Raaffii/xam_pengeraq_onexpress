const express = require("express");
const { validateBody } = require("../middlewares/validateSchema");
const {
  loginSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
} = require("../schemas/authSchema");
const {
  loginUser,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/authController");
const {
  loginLimiter,
  forgotPasswordLimiter,
} = require("../middlewares/rateLimiter");

const router = express.Router();

router.post("/login", loginLimiter, validateBody(loginSchema), loginUser);
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validateBody(passwordResetRequestSchema),
  requestPasswordReset,
);
router.post(
  "/reset-password",
  validateBody(passwordResetSchema),
  resetPassword,
);

module.exports = router;
