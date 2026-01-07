const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  validateMultiple,
  validateParams,
  validateBody,
} = require("../middlewares/validateSchema");
const {
  getSubjectGrades,
  updateGrade,
  deleteGrade,
  getGradeForScore,
  checkDuplicateGrades,
  cleanDuplicateGrades,
  checkSubjectsWithoutGrades,
  newGrade,
} = require("../controllers/subjGradeController");
const {
  subjIdParamsSchema,
  updateGradeSchema,
  getGradeForScoreParamsSchema,
  gradeSchema,
  getGradeForScoreQuerySchema,
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
  validateMultiple({
    params: getGradeForScoreParamsSchema,
    query: getGradeForScoreQuerySchema,
  }),
  getGradeForScore,
);

router.post("/grades", validateBody(gradeSchema), newGrade);

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
