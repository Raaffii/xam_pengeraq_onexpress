const { z } = require("zod");
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
  .int("Exam Series ID must be an integer")
  .positive("Exam Series ID must be positive")
  .optional()
  .nullable();

const createStudentSchema = z.object({
  studentName: studentNameSchema,
  studentIdNo: studentIdNoSchema,
  examSeriesId: examSeriesIdSchema,
});

const updateStudentSchema = z.object({
  studentName: studentNameSchema.optional(),
  studentIdNo: studentIdNoSchema.optional(),
  examSeriesId: examSeriesIdSchema.optional(),
});

const studentIdParamsSchema = z.object({
  studentId: z
    .string("Student ID is required")
    .pipe(
      z.coerce
        .number("Invalid Student ID")
        .int()
        .positive("Student ID must be a positive number"),
    ),
});

const fetchStudentExamsQuerySchema = z
  .object({
    searchTerm: z.string().max(100, "Search term too long").trim().optional(),
    bySeries: z.string().max(45, "Series filter too long").trim().optional(),
  })
  .and(paginationSchema);

module.exports = {
  createStudentSchema,
  updateStudentSchema,
  studentIdParamsSchema,
  fetchStudentExamsQuerySchema,
};
