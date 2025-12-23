const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  getExam,
  postExam,
  putExam,
  deleteExam,
} = require("../controllers/examController");
const router = express.Router();

router.get("/", authenticateToken, getExam);
router.post("/", authenticateToken, postExam);
router.put("/:id", authenticateToken, putExam);
router.delete("/:id", authenticateToken, deleteExam);
// router.post("/", authenticateToken, postExpaloc);
// router.put("/:id", authenticateToken, putExpaloc);
// router.delete("/:id", authenticateToken, deleteExpaloc);

module.exports = router;
