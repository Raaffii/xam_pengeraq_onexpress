const studentService = require("../services/studentService");

const getStudent = async (req, res) => {
  try {
    let { page, limit, searchTerm } = req.query;
    const filter = req.query;

    const result = await studentService.getStudent(
      page,
      limit,
      searchTerm,
      filter
    );
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
    console.error("get student error:", error);

    res.status(500).json({
      success: false,
      message: "get student failed",
      error: error.message,
    });
  }
};

const getStudentById = async (req, res) => {
  try {
    const studentId = req.params.id;
    const result = await studentService.getStudentById(studentId);
    res.status(200).json(result);
  } catch (error) {
    console.error("get student error:", error);
    if (error.message.includes("not found")) {
      return res.status(404).json({
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "get student failed",
      error: error.message,
    });
  }
};

const postStudent = async (req, res) => {
  try {
    const { userId } = req.user;
    const data = await studentService.postStudent(req.body, userId);
    res.status(200).json(data);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        error: true,
        message: "Duplicate entry",
      });
    }
    res.status(500).json({
      success: false,
      message: "add student failed",
      error: error.message,
    });
  }
};

const putStudent = async (req, res) => {
  try {
    const { userId } = req.user;
    const data = await studentService.putStudent(
      req.params.id,
      req.body,
      userId,
    );
    res.status(200).json(data);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        error: true,
        message: "Duplicate entry",
      });
    }
    res.status(500).json({
      success: false,
      message: "edit student failed",
      error: error.message,
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const data = await studentService.deleteStudent(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        error: true,
        message: "Duplicate entry",
      });
    }
    res.status(500).json({
      success: false,
      message: "delete student failed",
      error: error.message,
    });
  }
};
module.exports = {
  getStudent,
  postStudent,
  putStudent,
  deleteStudent,
  getStudentById,
};
