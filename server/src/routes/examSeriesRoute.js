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
router.get("/:seriesId", validateParams(idParamsSchema), getExamSeriesById);

router.post("/", validateBody(createExamSeriesSchema), createExamSeries);
router.put(
  "/:seriesId",
  validateMultiple({ params: idParamsSchema, body: updateExamSeriesSchema }),
  updateExamSeries,
);
router.delete("/:seriesId", validateParams(idParamsSchema), deleteExamSeries);

module.exports = router;
