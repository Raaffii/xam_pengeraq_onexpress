const Students = require("../models/studentModel");
const StudentExam = require("../models/studentExamModel");

const getStudent = async (page, limit, searchTerm) => {
  try {
    const result = await Students.getStudent(page, limit, searchTerm);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to register customer");
  }
};

const getStudentById = async (studentId) => {
  try {
    const result = await Students.getStudentById(studentId);

    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to register customer");
  }
};

const postStudent = async (data) => {
  try {
    const studentId = await Students.postStudent(data);
    const result = await StudentExam.postStudentExamSeries(
      data.examSeriesId,
      studentId
    );
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw error;
  }
};

const putStudent = async (id, data) => {
  try {
    const result = await Students.putStudent(id, data);

    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw error;
  }
};

const deleteStudent = async (id) => {
  try {
    const result = await Students.deleteStudent(id);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw error;
  }
};

module.exports = {
  getStudent,
  postStudent,
  putStudent,
  deleteStudent,
  getStudentById,
};
