const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  getExamResult,
  postExamResult,
  putExamResult,
  deleteExamResult,
} = require("../controllers/examResultController");

const {
  validateQuery,
  validateMultiple,
  validateBody,
  validateParams,
} = require("../middlewares/validateSchema");

const {
  createExamResultSchema,
  updateExamSchema,
  idParamsSchema,
  fetchExamsResultQuerySchema,
} = require("../schemas/examResultSchema");

const router = express.Router();

router.use(authenticateToken);

router.get("/:id", validateQuery(fetchExamsResultQuerySchema), getExamResult);
router.post("/", validateBody(createExamResultSchema), postExamResult);
router.put(
  "/:id",
  validateMultiple({ params: idParamsSchema, body: updateExamSchema }),
  putExamResult
);
router.delete("/:id", validateParams(idParamsSchema), deleteExamResult);
// router.post("/", authenticateToken, postExpaloc);
// router.put("/:id", authenticateToken, putExpaloc);
// router.delete("/:id", authenticateToken, deleteExpaloc);

module.exports = router;
