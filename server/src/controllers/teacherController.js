const teacherService = require("../services/teacherService");
const userService = require("../services/userService");

const getTeacher = async (req, res) => {
  try {
    let { page, pageSize, searchTerm } = req.query;

    const result = await teacherService.getTeacher({
      page,
      limit: pageSize,
      searchTerm,
    });
    res.status(200).json({
      data: result.data,
      pagination: {
        currentPage: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(result.total / pageSize),
        totalItems: result.total,
      },
    });
  } catch (error) {
    console.error("Failed to fetch teacher:", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getTeacherById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await teacherService.getTeacherById(id);
    res.status(200).json({
      data: result.data,
    });
  } catch (error) {
    console.error("Failed to fetch teacher by id:", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const postTeacher = async (req, res) => {
  try {
    const data = { ...req.body, enteredBy: req.user.userId };
    const accountAdd = req.body.addAccount;
    const teacherData = req.body;

    if (accountAdd) {
      const existingUser = await userService.findUserByEmail(
        teacherData.teacherEmail,
      );
      if (existingUser && existingUser.active === 1) {
        throw new Error("Email already exists");
      }
    }

    const dataId = await teacherService.postTeacher(data);

    if (accountAdd) {
      const userData = {
        userName: teacherData.teacherName,
        emailAddress: teacherData.teacherEmail,
        password: teacherData.password,
        role: "teacher",
        teacherId: dataId,
        enteredBy: req.user.userId,
      };

      const result = await userService.createUser(userData);
    }

    res.status(200).json(dataId);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Email already exists",
      });
    }
    if (
      error.message.includes("duplicate") ||
      error.message.includes("already exists") ||
      error.message.includes("Duplicate entry")
    ) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }
    res.status(500).json({
      message: "Failed to create teacher",
      error: error.message,
    });
  }
};

const putTeacher = async (req, res) => {
  try {
    const id = req.params.id;

    const inputData = { ...req.body, editedBy: req.user.userId };
    const data = await teacherService.putTeacher(inputData, id);

    res.status(200).json(data);
  } catch (error) {
    console.error("Failed to update teacher: ", error);
    if (error.message.includes("not found")) {
      return res.status(404).json({
        message: error.message,
      });
    }
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Duplicate entry",
      });
    }
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const id = req.params.id;
    await userService.teacherIdToNull(id);
    const data = await teacherService.deleteTeacher(id);

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    if (error.message.includes("not found")) {
      return res.status(404).json({
        message: error.message,
      });
    }
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Duplicate entry",
      });
    }
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message:
          "Cannot delete selected teacher because it is linked to an existing schedule.",
      });
    }

    res.status(500).json({
      message: "Failed to create setup",
      error: error.message,
    });
  }
};

module.exports = {
  getTeacher,
  postTeacher,
  putTeacher,
  getTeacherById,
  deleteTeacher,
};
