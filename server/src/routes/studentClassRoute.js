const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  getStudentClass,
  assignStudentClass,
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
  assignSchema,
  idParamsSchema,
  studentClassQuerySchema,
} = require("../schemas/studentClassSchema");

const router = express.Router();

router.use(authenticateToken);

router.get("/", validateQuery(studentClassQuerySchema), getStudentClass);

router.put("/", validateBody(assignSchema), assignStudentClass);

module.exports = router;
