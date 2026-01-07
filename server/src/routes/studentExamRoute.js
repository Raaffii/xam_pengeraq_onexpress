const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  getStudentExamSeries,
  getStudentExamSeriesById,
} = require("../controllers/studentExamController");

const { validateParams } = require("../middlewares/validateSchema");

const {
  studentExamSeriesParamsSchema,
} = require("../schemas/studentExamSeries");

const router = express.Router();

router.use(authenticateToken);

// router.get("/", getStudentExamSeries);
router.get(
  "/:id",
  validateParams(studentExamSeriesParamsSchema),
  getStudentExamSeriesById
);

module.exports = router;
