const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  validateQuery,
  validateMultiple,
  validateBody,
  validateParams,
} = require("../middlewares/validateSchema");
const { getTeacher } = require("../controllers/teacherController");
const {
  fetchSubjectsQuerySchema,
  createSubjectSchema,
  updateSubjectSchema,
  subjIdParamsSchema,
} = require("../schemas/subjectSchema");

router.use(authenticateToken);

router.get("/", getTeacher);

module.exports = router;
