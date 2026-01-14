const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  getClassScheduleDetail,
  openClassSession,
  deleteClassSchedule,
  startClassSession,
} = require("../controllers/classScheduleDetailController");

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

router.put("/", startClassSession); //console.log class schedule detail

router.get("/classsession/:id", openClassSession); //console.log class schedule detail

module.exports = router;
