const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  getStudentClass,
  postClassSchedule,
  deleteClassSchedule,
  putClassSchedule,
} = require("../controllers/studentClassController");

const {
  validateQuery,
  validateMultiple,
  validateBody,
  validateParams,
} = require("../middlewares/validateSchema");

const {
  createClassScheduleSchema,
  updateClassScheduleSchema,
  idParamsSchema,
  classScheduleQuerySchema,
} = require("../schemas/classScheduleSchema");

const router = express.Router();

router.use(authenticateToken);

router.get("/", getStudentClass); //console.log class schedule detail

module.exports = router;
