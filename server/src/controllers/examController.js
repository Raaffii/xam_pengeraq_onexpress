const examService = require("../services/examService");

const getExam = async (req, res) => {
  try {
    let { page, pageSize, searchTerm } = req.query;

    const result = await examService.getExam({ page, pageSize, searchTerm });
    res.status(200).json({
      data: result.data,
      pagination: {
        currentPage: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(result.total / pageSize),
        totalItems: result.total,
      },
    });
  } catch (error) {
    console.error("get exam error:", error);

    res.status(500).json({
      message: "Failed to fetch exams",
      error: error.message,
    });
  }
};

const getExamById = async (req, res) => {
  try {
    const id = req.params.examId;

    const result = await examService.getExamById(id);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.error("get exam error:", error);
    if (error.message.includes("not found")) {
      return res.status(404).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: "Failed to fetch exam",
      error: error.message,
    });
  }
};

const postExam = async (req, res) => {
  try {
    const data = await examService.postExam({
      ...req.body,
      enteredBy: req.user.userId,
    });

    res.status(200).json(data);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Duplicate entry",
      });
    }
    res.status(500).json({
      message: "Failed to create exam",
      error: error.message,
    });
  }
};

const putExam = async (req, res) => {
  try {
    const data = await examService.putExam(req.params.examId, {
      ...req.body,
      editedBy: req.user.userId,
    });
    res.status(200).json(data);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Duplicate entry",
      });
    }
    if (error.message.includes("not found")) {
      return res.status(404).json({
        message: error.message,
      });
    }
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const deleteExam = async (req, res) => {
  try {
    const data = await examService.deleteExam(req.params.examId);
    res.status(200).json(data);
  } catch (error) {
    if (error.message.includes("not found")) {
      return res.status(404).json({
        message: error.message,
      });
    }
    if (error.message.includes("Cannot delete or update a parent row")) {
      return res.status(409).json({
        message:
          "Cannot delete the exam, please delete the related data first!",
      });
    }
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
module.exports = {
  getExam,
  postExam,
  putExam,
  deleteExam,
  getExamById,
};
