const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");

const createRateLimiter = ({
  windowMs,
  limit,
  message,
  keyPrefix,
  skipSuccess = false,
  skipFailed = false,
  skip,
}) => {
  const limiterConfig = {
    windowMs,
    limit,
    message: {
      success: false,
      message,
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: skipSuccess,
    skipFailedRequests: skipFailed,
  };

  if (skip) {
    limiterConfig.skip = skip;
  }


  if (keyPrefix) {
    limiterConfig.keyGenerator = (req, res) =>
      `${keyPrefix}:${ipKeyGenerator(req, res)}`;
  }

  return rateLimit(limiterConfig);
};

const publicLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000,
  limit: 30,
  message: "Too many requests. Please wait a moment and try again",
  keyPrefix: "public",
});

const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "You've made too many requests. Please wait a few minutes and try again.",
  keyPrefix: "api",
});

const loginLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  message: "Too many login attempts, please try again after 10 minutes.",
  keyPrefix: "login",
  skipSuccess: true,
});

const registerLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: "Too many registration attempts, please try again after 15 minutes.",
  keyPrefix: "register",
  skipSuccess: true,
});

const forgotPasswordLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  message: "Too many password reset requests, please try again after an hour.",
  keyPrefix: "forgot-password",
});

const resetPasswordLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  message:
    "Too many password reset attempts, please try again after 15 minutes.",
  keyPrefix: "reset-password",
  skipSuccess: true,
});

module.exports = {
  publicLimiter,
  apiLimiter,
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
  createRateLimiter,
};
