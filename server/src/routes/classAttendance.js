const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  getClassAttendance,
} = require("../controllers/classAttendanceController");

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

router.get("/", getClassAttendance);

module.exports = router;
