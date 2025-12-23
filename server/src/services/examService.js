const Exam = require("../models/examModel");

const getExam = async (page, limit, search) => {
  try {
    const result = await Exam.getExam(page, limit, search);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to register customer");
  }
};

const postExam = async (data) => {
  try {
    const result = await Exam.postExam(data);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw error;
  }
};

const putExam = async (id, data) => {
  try {
    const result = await Exam.putExam(id, data);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw error;
  }
};

const deleteExam = async (id) => {
  try {
    const result = await Exam.deleteExam(id);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw error;
  }
};

module.exports = {
  getExam,
  postExam,
  putExam,
  deleteExam,
};
