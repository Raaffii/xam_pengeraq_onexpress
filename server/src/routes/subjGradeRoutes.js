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
  getSubjectGradesQuerySchema,
  updateGradeSchema,
  getGradeForScoreParamsSchema,
} = require("../schemas/subjGradeSchema");

router.use(authenticateToken);

router.get("/grades/check-duplicates", checkDuplicateGrades);
router.get("/grades/check-without-grades", checkSubjectsWithoutGrades);
router.delete("/grades/clean-duplicates", cleanDuplicateGrades);

router.get(
  "/:subjId/grades",
  validateMultiple({
    params: subjIdParamsSchema,
    query: getSubjectGradesQuerySchema,
  }),
  getSubjectGrades,
);

// Get grade for a specific score
router.get(
  "/:subjId/grades/byScore/:score",
  validateParams(getGradeForScoreParamsSchema),
  getGradeForScore,
);

router.put(
  "/:subjId/grades",
  validateMultiple({
    params: subjIdParamsSchema,
    body: updateGradeSchema,
  }),
  updateGrade,
);

router.delete(
  "/:subjId/grades",
  validateParams(subjIdParamsSchema),
  deleteGrade,
);

module.exports = router;
