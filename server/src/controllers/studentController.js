const studentService = require("../services/studentService");

const getStudent = async (req, res) => {
  try {
    let { page, limit, searchTerm } = req.query;
    const result = await studentService.getStudent(page, limit, searchTerm);
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
    console.error("get expaloc error:", error);

    res.status(500).json({
      success: false,
      message: "get expaloc failed",
      error: error.message,
    });
  }
};

const getStudentById = async (req, res) => {
  try {
    const studentId = req.params.id;
    const result = await studentService.getStudentById(studentId);
    res.status(200).json({
      data: result.data,
    });
  } catch (error) {
    console.error("get expaloc error:", error);

    res.status(500).json({
      success: false,
      message: "get expaloc failed",
      error: error.message,
    });
  }
};

const postStudent = async (req, res) => {
  try {
    const data = await studentService.postStudent(req.body);
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
      message: "get expaloc failed",
      error: error.message,
    });
  }
};

const putStudent = async (req, res) => {
  try {
    const data = await studentService.putStudent(req.params.id, req.body);
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
      message: "get expaloc failed",
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
      message: "get expaloc failed",
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
