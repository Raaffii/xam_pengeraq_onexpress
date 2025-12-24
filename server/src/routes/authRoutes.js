const express = require("express");
const { validateBody } = require("../middlewares/validateSchema");
const { loginSchema } = require("../schemas/authSchema");
const { loginUser } = require("../controllers/authController");
const { loginLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();

router.post("/login", loginLimiter, validateBody(loginSchema), loginUser);

module.exports = router;
