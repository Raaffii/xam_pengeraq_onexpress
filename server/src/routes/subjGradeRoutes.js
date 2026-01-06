const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  validateMultiple,
  validateParams,
} = require("../middlewares/validateSchema");
const {
  getSubjectGrades,
  updateGrade,
  deleteGrade,
  getGradeForScore,
  checkDuplicateGrades,
  cleanDuplicateGrades,
  checkSubjectsWithoutGrades,
} = require("../controllers/subjGradeController");
const {
  subjIdParamsSchema,
  updateGradeSchema,
  getGradeForScoreParamsSchema,
} = require("../schemas/subjGradeSchema");
const { gradeIdParamsSchema } = require("../schemas/examGradeSchema");

router.use(authenticateToken);

router.get("/grades/check-duplicates", checkDuplicateGrades);
router.get("/grades/check-without-grades", checkSubjectsWithoutGrades);
router.delete("/grades/clean-duplicates", cleanDuplicateGrades);

router.get(
  "/:subjId/grades",
  validateParams(subjIdParamsSchema),
  getSubjectGrades,
);

// Get grade for a specific score
router.get(
  "/:subjId/grades/byScore/:score",
  validateParams(getGradeForScoreParamsSchema),
  getGradeForScore,
);

router.put(
  "/grades/:gradeId",
  validateMultiple({
    params: gradeIdParamsSchema,
    body: updateGradeSchema,
  }),
  updateGrade,
);

router.delete(
  "/grades/:gradeId",
  validateParams(gradeIdParamsSchema),
  deleteGrade,
);

module.exports = router;
