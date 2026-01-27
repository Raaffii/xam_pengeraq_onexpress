const studentExamService = require("../services/studentExamService");
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
    console.error("get student exam series error:", error);

    res.status(500).json({
      success: false,
      message: "get student exam series failed",
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
      //   pagination: {
      //     currentPage: page,
      //     pageSize: limit,
      //     totalPages: Math.ceil(result.total / limit),
      //     totalItems: result.total,
      //   },
    });
  } catch (error) {
    console.error("get student exam series error:", error);

    res.status(500).json({
      success: false,
      message: "get student exam series failed",
      error: error.message,
    });
  }
};

const postTeacher = async (req, res) => {
  try {
    const data = { ...req.body, createdBy: req.user.userId };
    const dataId = await teacherService.postTeacher(data);

    const accountAdd = req.body.addAccount;
    const teacherData = req.body;
    if (accountAdd) {
      const userData = {
        userName: teacherData.userName,
        emailAddress: teacherData.teacherEmail,
        password: teacherData.password,
        role: "teacher",
        teacherId: dataId,
      };

      await userService.createUser(userData);
    }

    res.status(200).json(dataId);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Duplicate entry",
      });
    }
    res.status(500).json({
      message: "Failed to create setup",
      error: error.message,
    });
  }
};

const putTeacher = async (req, res) => {
  try {
    const id = req.params.id;

    const inputData = { ...req.body, editedBy: req.user.userId };
    const data = await teacherService.putTeacher(inputData, id);

    const accountAdd = req.body.addAccount;
    const teacherData = req.body;
    if (accountAdd) {
      const userData = {
        userName: teacherData.userName,
        emailAddress: teacherData.teacherEmail,
        password: teacherData.password,
        role: "teacher",
        teacherId: teacherData.teacherId,
        userId: teacherData.userId,
        editedBy: req.user.userId,
      };

      if (teacherData.userId) {
        await userService.updateUser(userData);
      } else {
        await userService.createUser(userData);
      }
    }

    res.status(200).json(data);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Duplicate entry",
      });
    }
    res.status(500).json({
      message: "Failed to create setup",
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
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Duplicate entry",
      });
    }
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        message:
          "Cannot delete teacher because it is linked to an existing schedule.",
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
