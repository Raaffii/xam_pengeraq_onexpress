const dashboardService = require("../services/dashboardService");

const getDashboard = async (req, res) => {
  try {
    let { page, pageSize, searchTerm, bySeries } = req.query;

    const result = await dashboardService.getExam(bySeries, {
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
        currentPage: Number(page),
        pageSize: Number(pageSize),
        totalItems: result.total,
        totalPages: Math.ceil(result.total / pageSize),
      };
    }

    res.status(200).json(response);
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).json({
        message: err.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = {
  getDashboard,
};
