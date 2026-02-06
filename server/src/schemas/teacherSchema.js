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

const createTeacherSchema = z.object({
  teacherName: teacherNameSchema,
  teacherEmail: emailSchema,
  password: passwordSchema.optional(),
  confirmPassword: passwordSchema.optional(),
  addAccount: z.boolean(),
});

const updateTeacherSchema = z.object({
  teacherName: teacherNameSchema.optional(),
  teacherEmail: emailSchema.optional(),
});

const fetchTeacher = z
  .object({
    bySeries: z.string().max(45, "Series filter too long").trim().optional(),
    searchTerm: z.string().max(100, "Search term too long").trim().optional(),
  })
  .and(paginationSchema);

const idParamsSchema = z.object({
  id: z
    .string("ID is required")
    .pipe(
      z.coerce
        .number("Invalid ID")
        .int()
        .positive("ID must be a positive number"),
    ),
});

module.exports = {
  createTeacherSchema,
  fetchTeacher,
  idParamsSchema,
  updateTeacherSchema,
};
