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
  resetUserPassword,
} = require("../controllers/userController");
const {
  fetchUsersQuerySchema,
  createUserSchema,
  userIdParamsSchema,
  updateUserSchema,
  resetPasswordSchema,
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
router.put(
  "/:userId/reset-password",
  validateMultiple({
    params: userIdParamsSchema,
    body: resetPasswordSchema,
  }),
  resetUserPassword,
);

router.delete("/:userId", validateParams(userIdParamsSchema), deleteUser);

module.exports = router;
