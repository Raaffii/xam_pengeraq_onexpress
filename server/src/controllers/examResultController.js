const examResultService = require("../services/examResultService");

const getExamResult = async (req, res) => {
  try {
    let { page, limit, search, byExamSeriesId } = req.query;

    const studentId = req.params.id;

    const result = await examResultService.getExamResult(
      page,
      limit,
      search,
      studentId,
      byExamSeriesId
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
    console.error("get exam result error:", error);

    res.status(500).json({
      success: false,
      message: "get exam result failed",
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
    console.error("get exam result error:", error);

    res.status(500).json({
      success: false,
      message: "add exam result failed",
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
      success: false,
      message: "edit exam result failed",
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
      success: false,
      message: "delete exam result failed",
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
