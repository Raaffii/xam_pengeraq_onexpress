const { z } = require("zod");
const { passwordSchema } = require("./authSchema");
const { paginationSchema } = require(".");

const scheduleId = z.coerce
  .number()
  .int("ID must be an integer")
  .positive("ID must be positive");

const numbersSchema = z.array(z.number());

const assignSchema = z.object({
  scheduleId: scheduleId.optional(),
  addStudents: numbersSchema.optional(),
  removeStudents: numbersSchema.optional(),
});

const idParamsSchema = z.object({
  id: z
    .string("User ID is required")
    .pipe(
      z.coerce
        .number("Invalid  student ID")
        .int()
        .positive("Student ID must be a positive number")
    ),
});

const studentClassQuerySchema = z
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
  idParamsSchema,
  studentClassQuerySchema,
  assignSchema,
};
