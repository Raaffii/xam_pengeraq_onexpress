const { z } = require("zod");
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
  .string("Mark is required")
  .regex(/^\d+\.\d{1,2}$/, "Mark must be in format XX.X or XX.XX")
  .transform((val) => parseFloat(val).toFixed(2))
  .refine(
    (val) => parseFloat(val) >= 0 && parseFloat(val) <= 100,
    "Mark must be between 0.00 and 100.00",
  );

const subjGpaSchema = z
  .string("GPA is required")
  .regex(/^\d+\.\d{1,2}$/, "GPA must be in format X.X or X.XX")
  .transform((val) => parseFloat(val).toFixed(2))
  .refine(
    (val) => parseFloat(val) >= 0 && parseFloat(val) <= 4,
    "GPA must be between 0.00 and 4.00",
  );

const subjGradeSchema = z
  .string("Grade letter is required")
  .min(1, "Grade letter is required")
  .max(2, "Grade letter must not exceed 2 characters")
  .trim();

const subjResultSchema = z
  .string("Result is required")
  .min(1, "Result is required")
  .max(20, "Result must not exceed 20 characters")
  .trim();

const studentSchema = z
  .int("Exam Student ID must be an integer")
  .positive("Exam Student ID must be positive")
  .nullable();

const retakeSchema = z.coerce
  .string()
  .default("false")
  .transform((val) => val === "true" || val === "1")
  .pipe(z.boolean());

const createExamResultSchema = z.object({
  examSeriesId: examSeriesIdSchema,
  examSubjId: examSubjIdScehma,
  marks: marksSchema,
  isRetake: retakeSchema,
  studentId: studentSchema,
  subjGpa: subjGpaSchema,
  subjGrade: subjGradeSchema,
  subjResult: subjResultSchema,
});

const updateExamSchema = z
  .object({
    marks: marksSchema.optional(),
    subjGpa: subjGpaSchema.optional(),
    subjGrade: subjGradeSchema.optional(),
    isRetake: retakeSchema.optional(),
    subjResult: subjResultSchema.optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided",
  );

const idParamsSchema = z.object({
  id: z
    .string("Exam Result ID is required")
    .pipe(
      z.coerce
        .number("Invalid  Exam ID")
        .int()
        .positive("Exam Result ID must be a positive number"),
    ),
});

const fetchExamsResultQuerySchema = z
  .object({
    searchTerm: z.string().max(100, "Search term too long").trim().optional(),
    studentId: z.string().max(45, "Series filter too long").trim().optional(),
    byExamSeriesId: z
      .string()
      .max(45, "Series filter too long")
      .trim()
      .optional(),
  })
  .and(paginationSchema);

module.exports = {
  createExamResultSchema,
  updateExamSchema,
  idParamsSchema,
  fetchExamsResultQuerySchema,
};
