const { z } = require("zod");
const { passwordSchema } = require("./authSchema");
const { paginationSchema } = require(".");

const ExamSeriesNameSchema = z
  .string("Name is required")
  .max(45, "Name must not exceed 45 characters")
  .trim();

const ExamSeriesDescription = z
  .string("ExamSeries Description No is required")
  .max(50, "ExamSeries Description no must not exceed 10 characters")
  .trim();

const dateSchema = z.coerce.date({
  invalid_type_error: "Invalid date",
});

const numberScheme = z.coerce
  .number({ invalid_type_error: "Credits must be a number" })
  .int("Credits must be an integer");

const examIdSchema = z.coerce
  .number({
    invalid_type_error: "Exam ID must be a number",
  })
  .int("Exam ID must be an integer")
  .positive("Exam ID must be greater than 0");

const createExamSeriesSchema = z.object({
  examSeriesDescription: ExamSeriesDescription,
  examSeriesEndDate: dateSchema,
  examSeriesStartDate: dateSchema,
  credits: numberScheme,
  importExamSeries: numberScheme,
  examId: examIdSchema,
});

const updateExamSeriesSchema = z.object({
  examSeriesDescription: ExamSeriesDescription.optional(),
  examSeriesEndDate: dateSchema.optional(),
  examSeriesStartDate: dateSchema.optional(),
  credits: numberScheme.optional(),
  examId: examIdSchema.optional(),
});

const idParamsSchema = z.object({
  id: z
    .string("User ID is required")
    .pipe(
      z.coerce
        .number("Invalid  ExamSeries ID")
        .int()
        .positive("ExamSeries ID must be a positive number")
    ),
});

const fetchExamSeriesQuerySchema = z
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
  createExamSeriesSchema,
  updateExamSeriesSchema,
  idParamsSchema,
  fetchExamSeriesQuerySchema,
};
