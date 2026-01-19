const { z } = require("zod");
const { passwordSchema } = require("./authSchema");
const { paginationSchema } = require(".");

const studentNameSchema = z
  .string("Name is required")
  .max(45, "Name must not exceed 45 characters")
  .trim();

const studentIdNoSchema = z
  .string("Student Id No is required")
  .max(10, "Student Id no must not exceed 10 characters")
  .trim();

const idSchema = z
  .number()
  .int("ID must be an integer")
  .positive("ID must be positive");

const startDateTimeSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Invalid datetime format");

const repeatValueSchema = z.enum(["daily", "weekly", "monthly"]);

const repeatFreqSchema = z.number().int("Repeat frequency must be an integer");

const createClassScheduleSchema = z.object({
  teacherId: idSchema,
  examSeriesId: idSchema,
  examSubjId: idSchema,
  locationId: idSchema,
  startDateTime: startDateTimeSchema,
  endDateTime: startDateTimeSchema.nullable().optional(),
  repeatValue: repeatValueSchema.nullable().optional(),
  repeatFreq: repeatFreqSchema,
});

const updateClassScheduleSchema = z.object({
  teacherId: idSchema.optional(),
  examSeriesId: idSchema.optional(),
  examSubjId: idSchema.optional(),
  locationId: idSchema.optional(),
  startDateTime: startDateTimeSchema.optional(),
  endDateTime: startDateTimeSchema.nullable().optional(),
  repeatValue: repeatValueSchema.nullable().optional(),
  repeatFreq: repeatFreqSchema.optional(),
});

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

const classScheduleDetailQuerySchema = z
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
  createClassScheduleSchema,
  idParamsSchema,
  classScheduleDetailQuerySchema,
  updateClassScheduleSchema,
};
