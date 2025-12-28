const examSeriesService = require("../services/examSeriesService");

const getExamSeries = async (req, res) => {
  try {
    let { page, limit, searchTerm, byExam } = req.query;
    const result = await examSeriesService.getExamSeries(
      page,
      limit,
      searchTerm,
      byExam
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
    console.error("get expaloc error:", error);

    res.status(500).json({
      success: false,
      message: "get expaloc failed",
      error: error.message,
    });
  }
};
const createExamSeries = async (req, res) => {
  try {
    const data = await examSeriesService.postExamSeries(req.body);
    res.status(200).json(data);
  } catch (error) {
    console.error("errro", error);
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

const updateExamSeries = async (req, res) => {
  try {
    const data = await examSeriesService.putExamSeries(req.params.id, req.body);
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

const deleteExamSeries = async (req, res) => {
  try {
    const { id } = req.params;

    const examSeriesData = {
      examSeriesToDelete: id,
      editedBy: req.user.userId,
    };

    await examSeriesService.deleteExamSeries(examSeriesData);
    res.status(200).json({ message: "User successfully deleted" });
  } catch (error) {
    console.error("Delete user error:", error.message);
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to delete" });
  }
};

module.exports = {
  getExamSeries,
  createExamSeries,
  updateExamSeries,
  deleteExamSeries,
};
