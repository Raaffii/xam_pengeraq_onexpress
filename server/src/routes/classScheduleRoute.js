const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  getClassSchedule,
  postClassSchedule,
  deleteClassSchedule,
  putClassSchedule,
  getClassScheduleById,
} = require("../controllers/classScheduleController");

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

router.get("/", validateQuery(classScheduleQuerySchema), getClassSchedule);
router.post("/", validateBody(createClassScheduleSchema), postClassSchedule);
router.get("/:id", validateParams(idParamsSchema), getClassScheduleById);
router.put(
  "/:id",
  validateMultiple({ params: idParamsSchema, body: updateClassScheduleSchema }),
  putClassSchedule
);
router.delete("/:id", validateParams(idParamsSchema), deleteClassSchedule);

module.exports = router;
