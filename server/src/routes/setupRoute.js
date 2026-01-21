const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  getSetup,
  postSetup,
  putSetup,
  deleteSetup,
  getSetupById,
} = require("../controllers/setupController");

const {
  validateQuery,
  validateMultiple,
  validateBody,
  validateParams,
} = require("../middlewares/validateSchema");

const {
  createSetupSchema,
  updateSetupSchema,
  idParamsSchema,
  fetchSetupQuerySchema,
} = require("../schemas/setupSchema");

const router = express.Router();

router.use(authenticateToken);

router.get("/", validateQuery(fetchSetupQuerySchema), getSetup);
router.get("/:setupId", validateParams(idParamsSchema), getSetupById);
router.post("/", validateBody(createSetupSchema), postSetup);
router.put(
  "/:setupId",
  validateMultiple({ params: idParamsSchema, body: updateSetupSchema }),
  putSetup,
);
router.delete("/:setupId", validateParams(idParamsSchema), deleteSetup);

module.exports = router;
