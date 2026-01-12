const studentExamService = require("../services/studentExamService");
const teacherService = require("../services/teacherService");

const getTeacher = async (req, res) => {
  try {
    // let { page, limit, searchTerm } = req.query;
    const result = await teacherService.getTeacher();
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

module.exports = {
  getTeacher,
};
