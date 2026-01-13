const { z } = require("zod");
const { paginationSchema } = require(".");

const ExamSeriesDescription = z
  .string("Exam Series Description is required")
  .max(50, "ExamSeries Description must not exceed 50 characters")
  .trim();

const dateSchema = z.coerce.date({
  invalid_type_error: "Invalid date",
});

const numberScheme = z
  .number("Credit must be a number")
  .int("Credit must be an integer")
  .min(0, "Credit must be non-negative")
  .max(999, "Credit must not exceed 999");

const examIdSchema = z.coerce
  .number({
    invalid_type_error: "Exam ID must be a number",
  })
  .int("Exam ID must be an integer")
  .positive("Exam ID must be greater than 0");

const createExamSeriesSchema = z.object({
  seriesDesc: ExamSeriesDescription,
  seriesEndDate: dateSchema,
  seriesStartDate: dateSchema,
  seriesCredit: numberScheme,
  importSeriesId: examIdSchema.optional(),
  examId: examIdSchema,
});

const updateExamSeriesSchema = z.object({
  seriesDesc: ExamSeriesDescription.optional(),
  seriesEndDate: dateSchema.optional(),
  seriesStartDate: dateSchema.optional(),
  seriesCredit: numberScheme.optional(),
  examId: examIdSchema.optional(),
});

const idParamsSchema = z.object({
  seriesId: z
    .string("Series ID is required")
    .pipe(
      z.coerce
        .number("Invalid  Exam Series ID")
        .int()
        .positive("Exam Series ID must be a positive number"),
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
