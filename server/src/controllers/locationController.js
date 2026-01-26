const studentExamService = require("../services/studentExamService");
const locationService = require("../services/locationService");
const userService = require("../services/userService");

const getLocation = async (req, res) => {
  try {
    let { page, limit, searchTerm } = req.query;

    const result = await locationService.getLocation(page, limit, searchTerm);
    res.status(200).json({
      data: result.data,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalPages: Math.ceil(result.total / limit),
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
    const result = await locationService.getTeacherById(id);
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

const postLocation = async (req, res) => {
  try {
    const data = { ...req.body, createdBy: req.user.userId };
    const dataId = await locationService.postLocation(data);

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

const putLocation = async (req, res) => {
  try {
    const id = req.params.id;

    const inputData = { ...req.body, editedBy: req.user.userId };
    const data = await locationService.putLocation(inputData, id);

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

const deleteLocation = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await locationService.deleteLocation(id);

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
          "Cannot delete location because it is linked to an existing schedule.",
      });
    }

    res.status(500).json({
      message: "Failed to create setup",
      error: error.message,
    });
  }
};

module.exports = {
  getLocation,
  postLocation,
  putLocation,
  getTeacherById,
  deleteLocation,
};
