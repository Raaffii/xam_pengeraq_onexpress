const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const { validateQuery } = require("../middlewares/validateSchema");
const { fetchUsers } = require("../controllers/userController");
const { fetchUsersQuerySchema } = require("../schemas/userSchema");

router.use(authenticateToken);

router.get("/", validateQuery(fetchUsersQuerySchema), fetchUsers);

module.exports = router;
