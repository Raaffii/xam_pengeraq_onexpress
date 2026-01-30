const examSeriesService = require("../services/examSeriesService");

const getExamSeries = async (req, res) => {
  try {
    let { page, pageSize, searchTerm, byExam, examId } = req.query;

    const result = await examSeriesService.getExamSeries(
      page,
      pageSize,
      searchTerm,
      byExam,
      examId,
    );

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
  } catch (error) {
    console.error("Error", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getExamSeriesById = async (req, res) => {
  try {
    const { seriesId } = req.params;
    const result = await examSeriesService.getExamSeriesById(seriesId);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const createExamSeries = async (req, res) => {
  try {
    const { userId } = req.user;
    const seriesData = {
      ...req.body,
      enteredBy: userId,
    };
    const data = await examSeriesService.postExamSeries(seriesData);

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
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const updateExamSeries = async (req, res) => {
  try {
    const { seriesId } = req.params;
    const seriesData = {
      ...req.body,
      seriesId,
      editedBy: req.user.userId,
    };
    const data = await examSeriesService.putExamSeries(seriesId, seriesData);
    res.status(200).json(data);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Duplicate entry",
        error: error.message,
      });
    }
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const deleteExamSeries = async (req, res) => {
  try {
    const { seriesId } = req.params;

    const examSeriesData = {
      examSeriesToDelete: seriesId,
      editedBy: req.user.userId,
    };

    await examSeriesService.deleteExamSeries(examSeriesData);
    res.status(200).json({ message: "Series successfully deleted" });
  } catch (error) {
    console.error("Delete series error:", error.message);
    if (error.message === "Series not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("Cannot delete or update a parent row")) {
      return res.status(409).json({
        message:
          "Cannot delete the series, please delete the related data first!",
      });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getExamSeries,
  createExamSeries,
  updateExamSeries,
  deleteExamSeries,
  getExamSeriesById,
};
