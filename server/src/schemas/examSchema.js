const { z } = require("zod");
const { passwordSchema } = require("./authSchema");
const { paginationSchema } = require(".");

const ExamNameSchema = z
  .string("Name is required")
  .max(45, "Name must not exceed 45 characters")
  .trim();

const ExamDescription = z
  .string("Exam Id No is required")
  .max(50, "Exam Id no must not exceed 10 characters")
  .trim();

const createExamSchema = z.object({
  examName: ExamNameSchema,
  examDescription: ExamDescription,
});

const updateExamSchema = z.object({
  examName: ExamNameSchema.optional(),
  examDescription: ExamDescription.optional(),
});

const idParamsSchema = z.object({
  id: z
    .string("User ID is required")
    .pipe(
      z.coerce
        .number("Invalid  Exam ID")
        .int()
        .positive("Exam ID must be a positive number")
    ),
});

const fetchExamsQuerySchema = z
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
  createExamSchema,
  updateExamSchema,
  idParamsSchema,
  fetchExamsQuerySchema,
};
