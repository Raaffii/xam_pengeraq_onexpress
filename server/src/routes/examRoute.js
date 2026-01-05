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
router.get("/:id", validateQuery(fetchExamsQuerySchema), getExamById);
router.post("/", validateBody(createExamSchema), postExam);
router.put(
  "/:id",
  validateMultiple({ params: idParamsSchema, body: updateExamSchema }),
  putExam
);
router.delete("/:id", validateParams(idParamsSchema), deleteExam);
// router.post("/", authenticateToken, postExpaloc);
// router.put("/:id", authenticateToken, putExpaloc);
// router.delete("/:id", authenticateToken, deleteExpaloc);

module.exports = router;
