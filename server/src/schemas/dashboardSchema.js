const { z } = require("zod");
const { paginationSchema } = require(".");

const dashboardQuerySchema = z
  .object({
    searchTerm: z.string().max(100, "Search term too long").trim().optional(),
    bySeries: z
      .string("Series ID is required")
      .pipe(
        z.coerce
          .number("Invalid Exam Series ID")
          .int()
          .positive("Exam Series ID must be a positive number"),
      )
      .optional(),
  })
  .and(paginationSchema);

const dashboardBodySchema = z.object({
  selectedStudents: z
    .array(z.number().int().positive("Student ID must be a positive number"))
    .optional()
    .default([]),
});

module.exports = {
  dashboardQuerySchema,
  dashboardBodySchema,
};
