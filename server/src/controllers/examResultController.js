const examResultService = require("../services/examResultService");

const getExamResult = async (req, res) => {
  try {
    let { page, pageSize, searchTerm, byExamSeriesId, studentId } = req.query;

    const result = await examResultService.getExamResult({
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      searchTerm,
      byExamSeriesId,
      studentId,
    });
    const response = {
      data: result.data,
    };

    if (page && pageSize) {
      response.pagination = {
        currentPage: result.page,
        pageSize: result.pageSize,
        totalItems: result.total,
        totalPages: Math.ceil(result.total / result.pageSize),
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

const postExamResult = async (req, res) => {
  try {
    const data = req.body;

    const result = await examResultService.postExamResult(data);

    if (!result.success) {
      return res.status(409).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("Error", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const putExamResult = async (req, res) => {
  try {
    const data = await examResultService.putExamResult(req.params.id, req.body);
    res.status(200).json(data);
  } catch (error) {
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

const deleteExamResult = async (req, res) => {
  try {
    const data = await examResultService.deleteExamResult(req.params.id);
    res.status(200).json(data);
  } catch (error) {
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

module.exports = {
  getExamResult,
  postExamResult,
  putExamResult,
  deleteExamResult,
};
