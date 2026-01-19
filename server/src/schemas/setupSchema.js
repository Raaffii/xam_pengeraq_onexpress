const { z } = require("zod");
const { paginationSchema } = require(".");

const CoyNameSchema = z
  .string("Name is required")
  .max(100, "Name must not exceed 100 characters")
  .trim();

const createSetupSchema = z.object({
  coyName: CoyNameSchema,
  addr1: z
    .string("Address is required")
    .max(100, "Address must not exceed 100 characters")
    .trim(),
  addr2: z
    .string("Address is required")
    .max(100, "Address must not exceed 100 characters")
    .trim()
    .optional(),
  addr3: z
    .string("Address is required")
    .max(100, "Address must not exceed 100 characters")
    .trim()
    .optional(),
  signatureName1: z
    .string("First Signature Name is required")
    .max(90, "First Signature Name must not exceed 90 characters")
    .trim(),
  signatureName2: z
    .string("Second Signature Name is required")
    .max(90, "Second Signature Name must not exceed 90 characters")
    .trim()
    .optional(),
  titleName1: z
    .string("First Title Name is required")
    .max(45, "First Title Name must not exceed 90 characters")
    .trim(),
  titleName2: z
    .string("second Title Name is required")
    .max(45, "second Title Name must not exceed 90 characters")
    .trim()
    .optional(),
});

const updateSetupSchema = z.object({
  coyName: CoyNameSchema.optional(),
  addr1: z
    .string("Address is required")
    .max(100, "Address must not exceed 100 characters")
    .trim()
    .optional(),
  addr2: z
    .string("Address is required")
    .max(100, "Address must not exceed 100 characters")
    .trim()
    .optional(),
  addr3: z
    .string("Address is required")
    .max(100, "Address must not exceed 100 characters")
    .trim()
    .optional(),
  signatureName1: z
    .string("First Signature Name is required")
    .max(90, "First Signature Name must not exceed 90 characters")
    .trim()
    .optional(),
  signatureName2: z
    .string("Second Signature Name is required")
    .max(90, "Second Signature Name must not exceed 90 characters")
    .trim()
    .optional(),
  titleName1: z
    .string("First Title Name is required")
    .max(45, "First Title Name must not exceed 90 characters")
    .trim()
    .optional(),
  titleName2: z
    .string("second Title Name is required")
    .max(45, "second Title Name must not exceed 90 characters")
    .trim()
    .optional(),
});

const idParamsSchema = z.object({
  setupId: z
    .string("Setup ID is required")
    .pipe(
      z.coerce
        .number("Invalid Setup ID")
        .int()
        .positive("Setup ID must be a positive number"),
    ),
});

const fetchSetupQuerySchema = z
  .object({
    searchTerm: z.string().max(100, "Search term too long").trim().optional(),
  })
  .and(paginationSchema);

module.exports = {
  createSetupSchema,
  updateSetupSchema,
  idParamsSchema,
  fetchSetupQuerySchema,
};
