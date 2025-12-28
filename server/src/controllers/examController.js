const examService = require("../services/examService");

const getExam = async (req, res) => {
  try {
    let { page, limit, searchTerm } = req.query;

    const result = await examService.getExam(page, limit, searchTerm);
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

const postExam = async (req, res) => {
  try {
    const data = await examService.postExam(req.body);

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

const putExam = async (req, res) => {
  try {
    const data = await examService.putExam(req.params.id, req.body);
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

const deleteExam = async (req, res) => {
  try {
    const data = await examService.deleteExam(req.params.id);
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
module.exports = {
  getExam,
  postExam,
  putExam,
  deleteExam,
};
