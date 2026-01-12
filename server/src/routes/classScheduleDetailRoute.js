const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  getClassScheduleDetail,
  postClassSchedule,
  deleteClassSchedule,
  putClassSchedule,
} = require("../controllers/examScheduleDetailController");

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

router.get("/", getClassScheduleDetail); //console.log class schedule detail

module.exports = router;
