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
  getTeacher,
  postTeacher,
  getTeacherById,
  putTeacher,
  deleteTeacher,
} = require("../controllers/teacherController");
const {
  fetchTeacher,
  createTeacherSchema,
  idParamsSchema,
  updateTeacherSchema,
} = require("../schemas/teacherSchema");

router.use(authenticateToken);

router.get("/", validateQuery(fetchTeacher), getTeacher);
router.get("/:id", getTeacherById);
router.post("/", validateBody(createTeacherSchema), postTeacher);
router.put(
  "/:id",
  validateMultiple({ params: idParamsSchema, body: updateTeacherSchema }),
  putTeacher,
);
router.delete("/:id", validateParams(idParamsSchema), deleteTeacher);

module.exports = router;
