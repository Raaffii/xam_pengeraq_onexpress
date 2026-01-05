const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  getFinalGrades,
  postFinalGrade,
  putFinalGrade,
  deleteFinalGrade,
} = require("../controllers/examGradeController");
const {
  validateBody,
  validateMultiple,
  validateParams,
} = require("../middlewares/validateSchema");
const {
  fetchGradesQuerySchema,
  gradeSchema,
  gradeIdParamsSchema,
  updateGradeSchema,
} = require("../schemas/examGradeSchema");

router.use(authenticateToken);

router.get("/", validateQuery(fetchGradesQuerySchema), getFinalGrades);
router.post("/", validateBody(gradeSchema), postFinalGrade);
router.put(
  "/:gradeId",
  validateMultiple({
    params: gradeIdParamsSchema,
    body: updateGradeSchema,
  }),
  putFinalGrade,
);
router.delete(
  "/:gradeId",
  validateParams(gradeIdParamsSchema),
  deleteFinalGrade,
);

module.exports = router;
