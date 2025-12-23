const { z } = require("zod");

const emailSchema = z
  .email("Invalid email format")
  .trim()
  .toLowerCase()
  .min(1, "Email address is required")
  .max(50, "Email address is too long");

const passwordSchema = z
  .string("Password is required")
  .trim()
  .min(6, "Password must be at least 6 characters long")
  .max(100, "Password is too long");

const loginSchema = z.object({
  emailAddress: emailSchema,
  password: passwordSchema,
});

module.exports = {
  loginSchema,
  passwordSchema,
};
