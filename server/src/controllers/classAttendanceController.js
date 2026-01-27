const ClassAttendanceService = require("../services/classAttendanceService");

const getClassAttendance = async (req, res) => {
  try {
    let { page, limit, searchTerm } = req.query;
    const filter = req.query;

    const result = await ClassAttendanceService.getClassAttendance(
      page,
      limit,
      searchTerm,
      filter,
    );
    res.status(200).json({
      data: result.data,
      pagination: {
        currentPage: Number(page),
        pageSize: Number(limit),
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
  getClassAttendance,
};
