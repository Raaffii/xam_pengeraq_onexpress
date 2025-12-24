const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const { getSubjects } = require("../controllers/subjectController");

router.use(authenticateToken);

router.get("/", getSubjects);

module.exports = router;
