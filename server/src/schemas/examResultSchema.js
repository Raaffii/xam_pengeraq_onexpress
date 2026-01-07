const { z } = require("zod");
const { passwordSchema } = require("./authSchema");
const { paginationSchema } = require(".");

const ExamNameSchema = z
  .string("Name is required")
  .max(45, "Name must not exceed 45 characters")
  .trim();

const examSeriesIdSchema = z
  .number()
  .int("Exam Series ID must be an integer")
  .positive("Exam Series ID must be positive")
  .nullable();

const examSubjIdScehma = z
  .number()
  .int("Exam Subject ID must be an integer")
  .positive("Exam Subject ID must be positive")
  .nullable();

const marksSchema = z
  .number()
  .min(0, "Marks must be at least 0")
  .max(100, "Marks must be at most 100");

const subjGpaSchema = z
  .string("Subject GPA is required")
  .max(50, "Subject GPA no must not exceed 4 characters")
  .trim(); /// console.log just for testing changeitu to number ************

const subjGradeSchema = z
  .string("Subject Grade Id No is required")
  .max(50, "Subject Grade no must not exceed 50 characters")
  .trim();

const subjResultSchema = z
  .string("Subject Result is required")
  .max(50, "Subject Result must not exceed 50 characters")
  .trim();

const studentSchema = z
  .int("Exam Student ID must be an integer")
  .positive("Exam Student ID must be positive")
  .nullable();

const retakeSchema = z
  .number()
  .int("Retake must be an integer")
  .min(0, "Retake must be 0 or 1")
  .max(1, "Retake must be 0 or 1");

const createExamResultSchema = z.object({
  examSeriesId: examSeriesIdSchema,
  examSubjId: examSubjIdScehma,
  marks: marksSchema,
  retake: retakeSchema,
  studentId: studentSchema,
  subjGpa: subjGpaSchema,
  subjGrade: subjGradeSchema,
  subjResults: subjResultSchema,
});

const updateExamSchema = z.object({
  marks: marksSchema.optional(),
  subjGpa: subjGpaSchema.optional(),
  subjGrade: subjGradeSchema.optional(),
  retake: retakeSchema.optional(),
  subjResults: subjResultSchema.optional(),
});

const idParamsSchema = z.object({
  id: z
    .string("Exam Result ID is required")
    .pipe(
      z.coerce
        .number("Invalid  Exam ID")
        .int()
        .positive("Exam Result ID must be a positive number")
    ),
});

const fetchExamsResultQuerySchema = z
  .object({
    search: z.string().max(100, "Search term too long").trim().optional(),
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
  createExamResultSchema,
  updateExamSchema,
  idParamsSchema,
  fetchExamsResultQuerySchema,
};
