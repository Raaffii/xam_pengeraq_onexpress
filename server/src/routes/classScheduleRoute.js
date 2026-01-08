const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { getExamSchedule } = require("../controllers/examScheduleController");

const {
  validateQuery,
  validateMultiple,
  validateBody,
  validateParams,
} = require("../middlewares/validateSchema");

const {
  createStudentSchema,
  updateStudentSchema,
  idParamsSchema,
  fetchStudentsQuerySchema,
} = require("../schemas/studentSchema");

const router = express.Router();

router.use(authenticateToken);

router.get("/", getExamSchedule);
// router.get("/:id", validateQuery(fetchStudentsQuerySchema), getStudentById);
// router.post("/", validateBody(createStudentSchema), postStudent);
// router.put(
//   "/:id",
//   validateMultiple({ params: idParamsSchema, body: updateStudentSchema }),
//   putStudent
// );
// router.delete("/:id", validateParams(idParamsSchema), deleteStudent);

module.exports = router;
