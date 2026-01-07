const { z } = require("zod");
const { paginationSchema } = require(".");

const gradeIdParamsSchema = z.object({
  gradeId: z
    .string("Grade ID is required")
    .pipe(
      z.coerce
        .number("Invalid grade ID")
        .int()
        .positive("Grade ID must be a positive number"),
    ),
});

const fetchGradesQuerySchema = z
  .object({
    byId: z.string().trim().optional(),
    bySeries: z.string().max(45, "Series filter too long").trim().optional(),
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

const gradeSchema = z.object({
  gradeSeq: z
    .number("Grade sequence is required")
    .int("Grade sequence must be an integer")
    .positive("Grade sequence must be positive"),
  finalPercent: z
    .string("Minimum score is required")
    .regex(/^\d+\.\d{2}$/, "Minimum score must be in format XX.XX")
    .refine(
      (val) => parseFloat(val) >= 0 && parseFloat(val) <= 100,
      "Minimum score must be between 0.00 and 100.00",
    ),
  grade: z
    .string("Grade letter is required")
    .min(1, "Grade letter is required")
    .max(2, "Grade letter must not exceed 2 characters")
    .trim(),
  gradePoint: z
    .string("Grade Point is required")
    .regex(/^\d+\.\d{1}$/, "Grade point must be in format X.X")
    .refine(
      (val) => parseFloat(val) >= 0 && parseFloat(val) <= 4,
      "Grade point must be between 0.0 and 4.0",
    ),
  gradeResult: z
    .string("Grade result is required")
    .min(1, "Grade result is required")
    .max(20, "Grade result must not exceed 20 characters")
    .trim(),
  seriesId: z
    .number()
    .int()
    .positive("Series ID must be positive")
    .optional()
    .nullable(),
});

const updateGradeSchema = z
  .object({
    gradeSeq: z
      .number("Grade sequence is required")
      .int("Grade sequence must be an integer")
      .positive("Grade sequence must be positive"),
    finalPercent: z
      .string("Minimum score is required")
      .regex(/^\d+\.\d{2}$/, "Minimum score must be in format XX.XX")
      .refine(
        (val) => parseFloat(val) >= 0 && parseFloat(val) <= 100,
        "Minimum score must be between 0.00 and 100.00",
      )
      .optional(),
    grade: z
      .string("Grade letter is required")
      .min(1, "Grade letter is required")
      .max(2, "Grade letter must not exceed 2 characters")
      .trim()
      .optional(),
    gradePoint: z
      .string("Grade Point is required")
      .regex(/^\d+\.\d{1}$/, "Grade point must be in format X.X")
      .refine(
        (val) => parseFloat(val) >= 0 && parseFloat(val) <= 4,
        "Grade point must be between 0.0 and 4.0",
      )
      .optional(),
    gradeResult: z
      .string("Grade result is required")
      .min(1, "Grade result is required")
      .max(20, "Grade result must not exceed 20 characters")
      .trim()
      .optional(),
    seriesId: z
      .number()
      .int()
      .positive("Series ID must be positive")
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided",
  );

module.exports = {
  fetchGradesQuerySchema,
  gradeIdParamsSchema,
  gradeSchema,
  updateGradeSchema,
};
