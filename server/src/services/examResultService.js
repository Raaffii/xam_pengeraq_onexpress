const ExamResult = require("../models/examResultModel");

const getExamResult = async (page, limit, search, studentId) => {
  try {
    const result = await ExamResult.getExamResult(
      page,
      limit,
      search,
      studentId
    );
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to register customer");
  }
};

module.exports = {
  getExamResult,
};
