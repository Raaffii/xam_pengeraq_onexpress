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

const updatePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

const passwordResetRequestSchema = z.object({
  emailAddress: emailSchema,
});

const passwordResetSchema = z
  .object({
    token: z.string("Reset token is required"),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

module.exports = {
  loginSchema,
  passwordSchema,
  updatePasswordSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
};
