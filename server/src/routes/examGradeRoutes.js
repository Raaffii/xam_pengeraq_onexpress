const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const { getExamGrades } = require("../controllers/examGradeController");

router.use(authenticateToken);

router.get("/", getExamGrades);

module.exports = router;
