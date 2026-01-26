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
  getLocation,
  postLocation,
  getTeacherById,
  putLocation,
  deleteLocation,
} = require("../controllers/locationController");
const {
  fetchLocation,
  createLocationSchema,
  idParamsSchema,
  updateLocationSchema,
} = require("../schemas/locationSchema");

router.use(authenticateToken);

router.get("/", validateQuery(fetchLocation), getLocation);
router.get("/:id", validateQuery(fetchLocation), getTeacherById);
router.post("/", validateBody(createLocationSchema), postLocation);
router.put(
  "/:id",
  validateMultiple({ params: idParamsSchema, body: updateLocationSchema }),
  putLocation,
);
router.delete("/:id", validateParams(idParamsSchema), deleteLocation);

module.exports = router;
