const examSeriesService = require("../services/examSeriesService");

const getExamSeries = async (req, res) => {
  try {
    let { page, limit, search } = req.query;
    const result = await examSeriesService.getExamSeries(page, limit, search);
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
module.exports = {
  getExamSeries,
};
