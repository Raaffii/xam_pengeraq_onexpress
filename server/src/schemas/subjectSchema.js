const { z } = require("zod");
const { paginationSchema } = require(".");

const subjCodeSchema = z
  .string("Subject code is required")
  .min(1, "Subject code is required")
  .max(10, "Subject code must not exceed 10 characters")
  .trim()
  .toUpperCase();

const subjDescSchema = z
  .string("Subject description is required")
  .min(1, "Subject description is required")
  .max(45, "Subject description must not exceed 45 characters")
  .trim();

const subjCreditSchema = z
  .number("Subject credit must be a number")
  .int("Subject credit must be an integer")
  .min(0, "Subject credit must be non-negative")
  .max(999, "Subject credit must not exceed 999");

const seriesIdSchema = z
  .number("Series ID must be a number")
  .int("Series ID must be an integer")
  .positive("Series ID must be positive")
  .optional()
  .nullable();

const createSubjectSchema = z.object({
  subjCode: subjCodeSchema,
  subjDesc: subjDescSchema,
  subjCredit: subjCreditSchema,
  seriesId: seriesIdSchema,
});

const updateSubjectSchema = z
  .object({
    subjCode: subjCodeSchema.optional(),
    subjDesc: subjDescSchema.optional(),
    subjCredit: subjCreditSchema.optional(),
    seriesId: seriesIdSchema,
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided",
  );

const fetchSubjectsQuerySchema = z
  .object({
    bySeries: z.string().max(45, "Series filter too long").trim().optional(),
    searchTerm: z.string().max(100, "Search term too long").trim().optional(),
  })
  .and(paginationSchema);

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

module.exports = {
  createSubjectSchema,
  updateSubjectSchema,
  fetchSubjectsQuerySchema,
  subjIdParamsSchema,
};
