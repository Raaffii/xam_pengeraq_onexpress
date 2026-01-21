const ExamResult = require("../models/examResultModel");

const getExamResult = async (options = {}) => {
  return await ExamResult.getExamResult(options);
};
const postExamResult = async (data) => {
  try {
    const existingResult = await ExamResult.checkExamResult(data);

    if (existingResult.length > 0) {
      return {
        success: false,
        message: "Exam result already exists",
        data: existingResult[0],
      };
    }

    const result = await ExamResult.postExamResult(data);
    return {
      success: true,
      message: "Exam result created",
      data: result,
    };
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to create exam result");
  }
};

const putExamResult = async (id, data) => {
  try {
    const result = await ExamResult.putExamResult(id, data);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw error;
  }
};

const deleteExamResult = async (id) => {
  try {
    const result = await ExamResult.deleteExamResult(id);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw error;
  }
};

module.exports = {
  getExamResult,
  postExamResult,
  putExamResult,
  deleteExamResult,
};
