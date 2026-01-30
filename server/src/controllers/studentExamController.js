const studentExamService = require("../services/studentExamService");

const getStudentExamSeries = async (req, res) => {
  try {
    let { page, pageSize, searchTerm, bySeries } = req.query;
    const result = await studentExamService.getStudentExam({
      page,
      pageSize,
      searchTerm,
      bySeries,
    });

    const response = {
      data: result.data,
    };
    if (page && pageSize) {
      response.pagination = {
        currentPage: parseInt(page),
        pageSize: parseInt(pageSize),
        totalItems: result.total,
        totalPages: Math.ceil(result.total / parseInt(pageSize)),
      };
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Failed to get student exam series:", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getStudentExamSeriesById = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const result =
      await studentExamService.getStudentExamByStudentId(studentId);
    res.status(200).json({
      data: result.data,
    });
  } catch (error) {
    console.error("Failed to fetch student exam series by studentId: ", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const deleteStudentExamByStudentId = async (req, res) => {
  try {
    const studentId = req.params.id;
    const result = await studentExamService.deleteStudentExam(studentId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to delete student exam by studentId: ", error);
    if (error.message.includes("not found")) {
      return res.status(404).json({
        message: error.message,
      });
    }
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const deleteStudentExamByExamId = async (req, res) => {
  try {
    const studentExamId = req.params.id;
    const result =
      await studentExamService.deleteStudentExamById(studentExamId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to delete student exam by examId: ", error);
    if (error.message.includes("not found")) {
      return res.status(404).json({
        message: error.message,
      });
    }
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getStudentExamSeries,
  getStudentExamSeriesById,
  deleteStudentExamByStudentId,
  deleteStudentExamByExamId,
};
