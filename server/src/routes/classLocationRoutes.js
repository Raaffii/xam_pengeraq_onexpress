const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  validateQuery,
  validateMultiple,
  validateBody,
  validateParams,
} = require("../middlewares/validateSchema");
const { getClassLocation } = require("../controllers/classLocationController");
const {
  fetchSubjectsQuerySchema,
  createSubjectSchema,
  updateSubjectSchema,
  subjIdParamsSchema,
} = require("../schemas/subjectSchema");

router.use(authenticateToken);

router.get("/", getClassLocation);

module.exports = router;
