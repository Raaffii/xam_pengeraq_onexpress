const Exam = require("../models/examModel");

const getExam = async (page, limit, searchTerm) => {
  try {
    const result = await Exam.getExam(page, limit, searchTerm);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Get exam failed");
  }
};

const getExamById = async (examId) => {
  try {
    const result = await Exam.getExamById(examId);

    if (!result) {
      const err = new Error("Exam not found");
      err.statusCode = 404;
      throw err;
    }

    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Get exam by id failed");
  }
};

const postExam = async (data) => {
  try {
    const result = await Exam.postExam(data);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Create Exam Failed");
  }
};

const putExam = async (id, data) => {
  try {
    const result = await Exam.putExam(id, data);

    if (!result) {
      const err = new Error("Exam not found");
      err.statusCode = 404;
      throw err;
    }

    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Update Exam Failed");
  }
};

const deleteExam = async (id) => {
  try {
    const result = await Exam.deleteExam(id);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Delete Exam Failed");
  }
};

module.exports = {
  getExam,
  postExam,
  putExam,
  deleteExam,
  getExamById,
};
