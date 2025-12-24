const { z } = require("zod");
const { passwordSchema } = require("./authSchema");
const { paginationSchema } = require(".");

const ExamSeriesNameSchema = z
  .string("Name is required")
  .max(45, "Name must not exceed 45 characters")
  .trim();

const ExamSeriesDescription = z
  .string("ExamSeries Id No is required")
  .max(50, "ExamSeries Id no must not exceed 10 characters")
  .trim();

const createExamSeriesSchema = z.object({
  ExamSeriesName: ExamSeriesNameSchema,
  ExamSeriesDescription: ExamSeriesDescription,
});

const updateExamSeriesSchema = z.object({
  ExamSeriesName: ExamSeriesNameSchema.optional(),
  ExamSeriesDescription: ExamSeriesDescription.optional(),
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

const fetchExamSeriessQuerySchema = z
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
  fetchExamSeriessQuerySchema,
};
