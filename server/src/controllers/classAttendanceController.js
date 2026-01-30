const ClassAttendanceService = require("../services/classAttendanceService");

const getClassAttendance = async (req, res) => {
  try {
    const filters = {
      page: Number(req.query.page),
      limit: Number(req.query.pageSize),
      searchTerm: req.query.searchTerm,
      classSchDetailsId: req.query.classSchDetailsId,
    };

    const result = await ClassAttendanceService.getClassAttendance(filters);
    res.status(200).json({
      data: result.data,
      pagination: {
        currentPage: filters.page,
        pageSize: filters.limit,
        totalPages: Math.ceil(result.total / filters.limit),
        totalItems: result.total,
      },
    });
  } catch (error) {
    console.error("Get class attendance error:", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getClassAttendance,
};
