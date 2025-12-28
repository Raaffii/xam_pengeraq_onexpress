const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { getExamResult } = require("../controllers/examResultController");

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

router.get("/:id", getExamResult);
// router.post("/", validateBody(createExamSchema), postExam);
// router.put(
//   "/:id",
//   validateMultiple({ params: idParamsSchema, body: updateExamSchema }),
//   putExam
// );
// router.delete("/:id", validateParams(idParamsSchema), deleteExam);
// router.post("/", authenticateToken, postExpaloc);
// router.put("/:id", authenticateToken, putExpaloc);
// router.delete("/:id", authenticateToken, deleteExpaloc);

module.exports = router;
