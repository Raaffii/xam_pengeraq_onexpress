const { z } = require("zod");

const subjIdParamsSchema = z.object({
  subjId: z
    .string("Subject ID is required")
    .pipe(
      z.coerce
        .number("Invalid subject ID")
        .int()
        .positive("Subject ID must be a positive number"),
    ),
});

const scoreParamsSchema = z.object({
  score: z
    .string("Score is required")
    .pipe(
      z.coerce
        .number("Invalid score")
        .min(0, "Score must be at least 0")
        .max(100, "Score must not exceed 100"),
    ),
});

const getGradeForScoreParamsSchema = z.object({
  subjId: z
    .string("Subject ID is required")
    .pipe(
      z.coerce
        .number("Invalid subject ID")
        .int()
        .positive("Subject ID must be a positive number"),
    ),
  score: z
    .string("Score is required")
    .pipe(
      z.coerce
        .number("Invalid score")
        .min(0, "Score must be at least 0")
        .max(100, "Score must not exceed 100"),
    ),
});

const getGradeForScoreQuerySchema = z.object({
  isRetake: z
    .string()
    .optional()
    .default("false")
    .transform((val) => val === "true" || val === "1")
    .pipe(z.boolean()),
});

const getSubjectGradesQuerySchema = z.object({
  seriesId: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined))
    .pipe(
      z
        .number()
        .int()
        .positive("Series ID must be a positive number")
        .optional(),
    ),
});

const gradeSchema = z
  .object({
    subjId: z
      .number("Subject ID is required")
      .int()
      .positive("Subject ID must be positive"),
    gradeSeq: z
      .number("Grade sequence is required")
      .int("Grade sequence must be an integer")
      .positive("Grade sequence must be positive"),
    subjMin: z
      .string("Minimum score is required")
      .regex(/^\d+\.\d{1,2}$/, "Minimum score must be in format XX.X or XX.XX")
      .transform((val) => parseFloat(val).toFixed(2))
      .refine(
        (val) => parseFloat(val) >= 0 && parseFloat(val) <= 100,
        "Minimum score must be between 0.00 and 100.00",
      ),
    subjMax: z
      .string("Maximum score is required")
      .regex(/^\d+\.\d{1,2}$/, "Maximum score must be in format XX.X or XX.XX")
      .transform((val) => parseFloat(val).toFixed(2))
      .refine(
        (val) => parseFloat(val) >= 0 && parseFloat(val) <= 100,
        "Maximum score must be between 0.00 and 100.00",
      ),
    subjGrade: z
      .string("Grade letter is required")
      .min(1, "Grade letter is required")
      .max(2, "Grade letter must not exceed 2 characters")
      .trim(),
    subjGpa: z
      .string("GPA is required")
      .regex(/^\d+\.\d{1,2}$/, "GPA must be in format X.X or X.XX")
      .transform((val) => parseFloat(val).toFixed(2))
      .refine(
        (val) => parseFloat(val) >= 0 && parseFloat(val) <= 4,
        "GPA must be between 0.00 and 4.00",
      ),
    subjResult: z
      .string("Result description is required")
      .min(1, "Result description is required")
      .max(20, "Result description must not exceed 20 characters")
      .trim(),
    seriesId: z
      .number()
      .int()
      .positive("Series ID must be positive")
      .optional()
      .nullable(),
  })
  .refine((data) => parseFloat(data.subjMin) < parseFloat(data.subjMax), {
    message: "Minimum score must be less than maximum score",
    path: ["subjMin"],
  });

const updateGradeSchema = z
  .object({
    gradeSeq: z
      .number("Grade sequence must be a number")
      .int("Grade sequence must be an integer")
      .positive("Grade sequence must be positive")
      .optional(),
    subjMin: z
      .string()
      .regex(/^\d+\.\d{1,2}$/, "Minimum score must be in format XX.X or XX.XX")
      .transform((val) => parseFloat(val).toFixed(2))
      .refine(
        (val) => parseFloat(val) >= 0 && parseFloat(val) <= 100,
        "Minimum score must be between 0.00 and 100.00",
      )
      .optional(),
    subjMax: z
      .string()
      .regex(/^\d+\.\d{1,2}$/, "Maximum score must be in format XX.X or XX.XX")
      .transform((val) => parseFloat(val).toFixed(2))
      .refine(
        (val) => parseFloat(val) >= 0 && parseFloat(val) <= 100,
        "Maximum score must be between 0.00 and 100.00",
      )
      .optional(),
    subjGrade: z
      .string()
      .min(1, "Grade letter is required")
      .max(2, "Grade letter must not exceed 2 characters")
      .trim()
      .optional(),
    subjGpa: z
      .string()
      .regex(/^\d+\.\d{1,2}$/, "GPA must be in format X.X or X.XX")
      .transform((val) => parseFloat(val).toFixed(2))
      .refine(
        (val) => parseFloat(val) >= 0 && parseFloat(val) <= 4,
        "GPA must be between 0.00 and 4.00",
      )
      .optional(),
    subjResult: z
      .string()
      .min(1, "Result description is required")
      .max(20, "Result description must not exceed 20 characters")
      .trim()
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided",
  )
  .refine(
    (data) => {
      if (data.subjMin !== undefined && data.subjMax !== undefined) {
        return parseFloat(data.subjMin) < parseFloat(data.subjMax);
      }
      return true;
    },
    {
      message: "Minimum score must be less than maximum score",
      path: ["subjMin"],
    },
  );

module.exports = {
  subjIdParamsSchema,
  scoreParamsSchema,
  getGradeForScoreParamsSchema,
  getGradeForScoreQuerySchema,
  getSubjectGradesQuerySchema,
  gradeSchema,
  updateGradeSchema,
};
