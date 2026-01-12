const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  getExam,
  postExam,
  putExam,
  deleteExam,
  getExamById,
} = require("../controllers/examController");

const {
  validateQuery,
  validateMultiple,
  validateBody,
  validateParams,
} = require("../middlewares/validateSchema");

const {
  createExamSchema,
  updateExamSchema,
  idParamsSchema,
  fetchExamsQuerySchema,
} = require("../schemas/examSchema");

const router = express.Router();

router.use(authenticateToken);

router.get("/", validateQuery(fetchExamsQuerySchema), getExam);
router.get("/:examId", validateParams(idParamsSchema), getExamById);
router.post("/", validateBody(createExamSchema), postExam);
router.put(
  "/:examId",
  validateMultiple({ params: idParamsSchema, body: updateExamSchema }),
  putExam,
);
router.delete("/:examId", validateParams(idParamsSchema), deleteExam);

module.exports = router;
