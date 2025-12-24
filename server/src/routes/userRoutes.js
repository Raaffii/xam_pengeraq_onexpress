const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  validateQuery,
  validateMultiple,
  validateBody,
  validateParams,
} = require("../middlewares/validateSchema");
const {
  fetchUsers,
  createUser,
  deleteUser,
  updateUser,
} = require("../controllers/userController");
const {
  fetchUsersQuerySchema,
  createUserSchema,
  userIdParamsSchema,
  updateUserSchema,
} = require("../schemas/userSchema");

router.use(authenticateToken);

router.get("/", validateQuery(fetchUsersQuerySchema), fetchUsers);
router.post("/", validateBody(createUserSchema), createUser);
router.put(
  "/:userId",
  validateMultiple({
    params: userIdParamsSchema,
    body: updateUserSchema,
  }),
  updateUser,
);
router.delete("/:userId", validateParams(userIdParamsSchema), deleteUser);

module.exports = router;
