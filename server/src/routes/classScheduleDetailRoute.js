const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  getClassScheduleDetail,
  getClassScheduleDetailById,
  openClassSession,
  startClassSession,
} = require("../controllers/classScheduleDetailController");

const { validateQuery } = require("../middlewares/validateSchema");

const {
  classScheduleDetailQuerySchema,
} = require("../schemas/classScheduleDetailSchema");

const router = express.Router();

router.use(authenticateToken);

router.get(
  "/",
  validateQuery(classScheduleDetailQuerySchema),
  getClassScheduleDetail,
);

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
