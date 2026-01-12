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
  getSubjects,
  postSubj,
  putSubj,
  deleteSubj,
  getSubjectsByExamSeriesId,
} = require("../controllers/subjectController");
const {
  fetchSubjectsQuerySchema,
  createSubjectSchema,
  updateSubjectSchema,
  subjIdParamsSchema,
} = require("../schemas/subjectSchema");

router.use(authenticateToken);

router.get("/", validateQuery(fetchSubjectsQuerySchema), getSubjects);
router.get(
  "/:examSeriesId",
  validateParams(subjIdParamsSchema),
  getSubjectsByExamSeriesId,
);
router.post("/", validateBody(createSubjectSchema), postSubj);
router.put(
  "/:subjId",
  validateMultiple({
    params: subjIdParamsSchema,
    body: updateSubjectSchema,
  }),
  putSubj,
);
router.delete("/:subjId", validateParams(subjIdParamsSchema), deleteSubj);

module.exports = router;
