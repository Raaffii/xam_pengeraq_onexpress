const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  getClassScheduleDetail,
  getClassScheduleDetailById,
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
  classScheduleDetailQuerySchema,
} = require("../schemas/classScheduleDetailSchema");

const router = express.Router();

router.use(authenticateToken);

router.get(
  "/",
  validateQuery(classScheduleDetailQuerySchema),
  getClassScheduleDetail,
); //console.log class schedule detail

router.get(
  "/:id",
  validateQuery(classScheduleDetailQuerySchema),
  getClassScheduleDetailById,
);

router.put(
  "/classsession/:id",
  validateQuery(classScheduleDetailQuerySchema),
  startClassSession,
); //console.log class schedule detail

router.get(
  "/classsession/:id",
  validateQuery(classScheduleDetailQuerySchema),
  openClassSession,
); //console.log class schedule detail

module.exports = router;
