const { z } = require("zod");
const { passwordSchema } = require("./authSchema");
const { paginationSchema } = require(".");

const emailSchema = z
  .email("Invalid email address")
  .max(50, "Email must not exceed 50 characters");

const roleSchema = z.enum(["admin", "teacher", "student"], {
  errorMap: () => ({
    message: "Role must be either admin, teacher or student",
  }),
});

const nameSchema = z
  .string("User Name is required")
  .max(45, "Name must not exceed 45 characters")
  .trim();

const studentIdSchema = z
  .number()
  .int("Student ID must be an integer")
  .positive("Student ID must be positive")
  .optional()
  .nullable();

const createUserSchema = z.object({
  userName: nameSchema,
  emailAddress: emailSchema,
  password: passwordSchema,
  role: roleSchema.optional().default("student"),
  studentId: studentIdSchema,
});

const updateUserSchema = z.object({
  userName: nameSchema.optional(),
  emailAddress: emailSchema.optional(),
  role: roleSchema.optional(),
  studentId: studentIdSchema,
});

const fetchUsersQuerySchema = z
  .object({
    byRole: roleSchema.optional(),
    searchTerm: z.string().max(100, "Search term too long").trim().optional(),
    isActive: z
      .string()
      .optional()
      .transform((val) => {
        if (val === undefined || val === "true" || val === "1") {
          return true;
        }
        if (val === "false" || val === "0") {
          return false;
        }
        if (val === "null" || val === "") {
          return null;
        }
        return true;
      })
      .nullable(),
  })
  .and(paginationSchema);

const userIdParamsSchema = z.object({
  userId: z
    .string("User ID is required")
    .pipe(
      z.coerce
        .number("Invalid user ID")
        .int()
        .positive("User ID must be a positive number"),
    ),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

const updateProfileSchema = z
  .object({
    name: nameSchema.optional(),
    emailAddress: emailSchema.optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided",
  );

module.exports = {
  createUserSchema,
  updateUserSchema,
  fetchUsersQuerySchema,
  updateProfileSchema,
  userIdParamsSchema,
  changePasswordSchema,
};
