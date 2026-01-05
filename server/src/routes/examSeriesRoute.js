const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  getExamSeries,
  createExamSeries,
  updateExamSeries,
  deleteExamSeries,
  getExamSeriesById,
} = require("../controllers/examSeriesController");

const {
  validateQuery,
  validateMultiple,
  validateBody,
  validateParams,
} = require("../middlewares/validateSchema");

const {
  createExamSeriesSchema,
  updateExamSeriesSchema,
  idParamsSchema,
  fetchExamSeriesQuerySchema,
} = require("../schemas/examSeriesSchema");

const router = express.Router();
router.use(authenticateToken);

router.get("/", validateQuery(fetchExamSeriesQuerySchema), getExamSeries);
router.get(
  "/:id",
  validateQuery(fetchExamSeriesQuerySchema),
  getExamSeriesById
);
router.post("/", validateBody(createExamSeriesSchema), createExamSeries);
router.put(
  "/:id",
  validateMultiple({ params: idParamsSchema, body: updateExamSeriesSchema }),
  updateExamSeries
);
router.delete("/:id", validateParams(idParamsSchema), deleteExamSeries);
// router.post("/", authenticateToken, postExpaloc);
// router.put("/:id", authenticateToken, putExpaloc);
// router.delete("/:id", authenticateToken, deleteExpaloc);

module.exports = router;
