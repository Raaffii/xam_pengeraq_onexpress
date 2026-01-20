const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  getClassAttendance,
} = require("../controllers/classAttendanceController");

const { validateQuery } = require("../middlewares/validateSchema");

const { fetchStudentsQuerySchema } = require("../schemas/studentSchema");

const router = express.Router();

router.use(authenticateToken);

router.get("/", validateQuery(fetchStudentsQuerySchema), getClassAttendance);

module.exports = router;
