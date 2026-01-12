const classScheduleDetailService = require("../services/examScheduleDetailService");

const getClassScheduleDetail = async (req, res) => {
  try {
    let { page, limit, searchTerm, date } = req.query;

    const result = await classScheduleDetailService.getClassScheduleDetail(
      page,
      limit,
      searchTerm,
      date
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
  getClassScheduleDetail,
};
