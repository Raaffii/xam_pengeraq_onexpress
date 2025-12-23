const { z } = require("zod");

const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || (val > 0 && Number.isInteger(val)), {
      message: "Page must be a positive integer",
    }),
  pageSize: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine(
      (val) =>
        val === undefined || (val > 0 && val <= 100 && Number.isInteger(val)),
      {
        message: "Page size must be a positive integer between 1 and 100",
      },
    ),
});

const booleanStringSchema = z
  .union([z.boolean(), z.number(), z.string()])
  .optional()
  .nullable()
  .transform((val) => {
    if (val === null || val === undefined || val === "") return null;
    if (typeof val === "number") return val === 1;
    if (typeof val === "boolean") return val;
    return val === "1" || val === "true";
  });

module.exports = {
  paginationSchema,
  booleanStringSchema,
};
