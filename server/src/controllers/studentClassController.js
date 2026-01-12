const studentClassService = require("../services/studentClassService");

const getStudentClass = async (req, res) => {
  try {
    let { page, limit, searchTerm, schedule } = req.query;
    const result = await studentClassService.getStudentClass(
      page,
      limit,
      searchTerm,
      schedule
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

module.exports = {
  getStudentClass,
};
