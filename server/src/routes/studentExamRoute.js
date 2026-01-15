const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  getStudentExamSeries,
  getStudentExamSeriesById,
} = require("../controllers/studentExamController");

const {
  validateParams,
  validateQuery,
} = require("../middlewares/validateSchema");
const {
  studentIdParamsSchema,
  fetchStudentExamsQuerySchema,
} = require("../schemas/studentExamSeries");

const router = express.Router();

router.use(authenticateToken);

router.get(
  "/",
  validateQuery(fetchStudentExamsQuerySchema),
  getStudentExamSeries,
);
router.get(
  "/:studentId",
  validateParams(studentIdParamsSchema),
  getStudentExamSeriesById,
);

module.exports = router;
