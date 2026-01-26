const { z } = require("zod");
const { paginationSchema } = require(".");

const locationNameSchema = z.string("Name is required").trim();

const createLocationSchema = z.object({
  locationName: locationNameSchema,
});

const updateLocationSchema = z.object({
  locationName: locationNameSchema.optional(),
});

const fetchLocation = z
  .object({
    bySeries: z.string().max(45, "Series filter too long").trim().optional(),
    searchTerm: z.string().max(100, "Search term too long").trim().optional(),
  })
  .and(paginationSchema);

const idParamsSchema = z.object({
  id: z
    .string("User ID is required")
    .pipe(
      z.coerce
        .number("Invalid  student ID")
        .int()
        .positive("Student ID must be a positive number"),
    ),
});

module.exports = {
  createLocationSchema,
  fetchLocation,
  idParamsSchema,
  updateLocationSchema,
};
