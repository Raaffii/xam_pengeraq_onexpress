const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  validateQuery,
  validateMultiple,
  validateBody,
  validateParams,
} = require("../middlewares/validateSchema");
const {
  getTeacher,
  postTeacher,
  getTeacherById,
  putTeacher,
  deleteTeacher,
} = require("../controllers/teacherController");
const {
  fetchSubjectsQuerySchema,
  createSubjectSchema,
  updateSubjectSchema,
  subjIdParamsSchema,
} = require("../schemas/subjectSchema");

router.use(authenticateToken);

router.get("/", getTeacher);
router.get("/:id", getTeacherById);
router.post("/", postTeacher);
router.put("/:id", putTeacher);
router.delete("/:id", deleteTeacher);

module.exports = router;
