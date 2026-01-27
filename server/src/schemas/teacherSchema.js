const { z } = require("zod");
const { paginationSchema } = require(".");

const teacherNameSchema = z
  .string()
  .min(2, "Teacher name minimum 2 characters")
  .max(100, "Teacher name maximum 100 characters");

const emailSchema = z.string().email("Invalid email format");

const passwordSchema = z
  .string()
  .min(8, "Password minimum 8 characters")
  .optional()
  .or(z.literal(""));

const userNameSchema = z
  .string("Name is required")
  .max(10, "Name must not exceed 10 characters")
  .trim();

const createTeacherSchema = z.object({
  teacherName: teacherNameSchema,
  teacherEmail: emailSchema,

  userName: userNameSchema.optional(),

  password: passwordSchema.optional(),
  confirmPassword: passwordSchema.optional(),

  addAccount: z.boolean(),
});

const updateTeacherSchema = z.object({
  teacherId: z
    .number()
    .int("Teacher ID must be integer")
    .positive("Teacher ID must be positive"),

  userId: z
    .number()
    .int("User ID must be integer")
    .positive("User ID must be positive")
    .optional()
    .nullable(),

  teacherName: teacherNameSchema.optional(),

  teacherEmail: emailSchema.optional(),

  userName: userNameSchema.optional(),

  password: passwordSchema.optional(),

  confirmPassword: passwordSchema.optional(),

  addAccount: z.boolean().optional(),
});

const fetchTeacher = z
  .object({
    bySeries: z.string().max(45, "Series filter too long").trim().optional(),
    searchTerm: z.string().max(100, "Search term too long").trim().optional(),
  })
  .and(paginationSchema);

const subjIdParamsSchema = z.object({
  subjId: z
    .string("Subject ID is required")
    .pipe(
      z.coerce
        .number("Invalid subject ID")
        .int()
        .positive("Subject ID must be a positive number"),
    ),
});

const idParamsSchema = z.object({
  id: z
    .string("User ID is required")
    .pipe(
      z.coerce
        .number("Invalid  student ID")
        .int()
        .positive("Student ID must be a positive number"),
    ),
});

module.exports = {
  createTeacherSchema,
  fetchTeacher,
  subjIdParamsSchema,
  idParamsSchema,
  updateTeacherSchema,
};
