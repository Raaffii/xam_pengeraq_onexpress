const { z } = require("zod");
const { passwordSchema } = require("./authSchema");
const { paginationSchema } = require(".");

const studentNameSchema = z
  .string("Name is required")
  .max(45, "Name must not exceed 45 characters")
  .trim();

const studentIdNoSchema = z
  .string("Student Id No is required")
  .max(10, "Student Id no must not exceed 10 characters")
  .trim();

const examSeriesIdSchema = z
  .number()
  .int("Student ID must be an integer")
  .positive("Student ID must be positive")
  .optional()
  .nullable();

const createStudentSchema = z.object({
  studentName: studentNameSchema,
  studentIdNo: studentIdNoSchema,
  examSeriesId: examSeriesIdSchema,
});

const updateUserSchema = z.object({
  studentName: studentNameSchema.optional(),
  studentIdNo: studentIdNoSchema.optional(),
  examSeriesId: examSeriesIdSchema.optional(),
});

const idParamsSchema = z.object({
  id: z
    .string("User ID is required")
    .pipe(
      z.coerce
        .number("Invalid  student ID")
        .int()
        .positive("Student ID must be a positive number")
    ),
});

const fetchStudentsQuerySchema = z
  .object({
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

module.exports = {
  createStudentSchema,
  updateUserSchema,
  idParamsSchema,
  fetchStudentsQuerySchema,
};
