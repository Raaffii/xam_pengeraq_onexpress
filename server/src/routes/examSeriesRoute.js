const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { getExamSeries } = require("../controllers/examSeriesController");
const router = express.Router();

router.get("/", authenticateToken, getExamSeries);

// router.post("/", authenticateToken, postExpaloc);
// router.put("/:id", authenticateToken, putExpaloc);
// router.delete("/:id", authenticateToken, deleteExpaloc);

module.exports = router;
