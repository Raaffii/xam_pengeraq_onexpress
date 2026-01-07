const StudentsExam = require("../models/studentExamModel");

const getStudentExam = async (page, limit, searchTerm) => {
  try {
    const result = await StudentsExam.getStudentExam(page, limit, searchTerm);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to get student exam series");
  }
};

const getStudentExamById = async (studentId) => {
  try {
    const result = await StudentsExam.getStudentExamById(studentId);

    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to get student exam series");
  }
};

module.exports = {
  getStudentExam,
  getStudentExamById,
};
