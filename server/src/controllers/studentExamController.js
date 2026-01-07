const studentExamService = require("../services/studentExamService");

const getStudentExamSeries = async (req, res) => {
  try {
    let { page, limit, searchTerm } = req.query;
    const result = await studentExamService.getStudentExam(
      page,
      limit,
      searchTerm
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
    console.error("get student exam series error:", error);

    res.status(500).json({
      success: false,
      message: "get student exam series failed",
      error: error.message,
    });
  }
};

const getStudentExamSeriesById = async (req, res) => {
  try {
    const studentId = req.params.id;
    const result = await studentExamService.getStudentExamById(studentId);
    res.status(200).json({
      data: result.data,
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

module.exports = {
  getStudentExamSeries,
  getStudentExamSeriesById,
};
