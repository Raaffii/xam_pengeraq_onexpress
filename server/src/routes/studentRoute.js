const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { getStudent } = require("../controllers/studentController");
const router = express.Router();

router.get("/", authenticateToken, getStudent);
// router.post("/", authenticateToken, postExpaloc);
// router.put("/:id", authenticateToken, putExpaloc);
// router.delete("/:id", authenticateToken, deleteExpaloc);

module.exports = router;
