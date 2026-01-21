const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { getDashboard } = require("../controllers/dashboardController");
const { validateQuery } = require("../middlewares/validateSchema");
const { dashboardQuerySchema } = require("../schemas/dashboardSchema");

const router = express.Router();

router.use(authenticateToken);

router.get("/", validateQuery(dashboardQuerySchema), getDashboard);

module.exports = router;
