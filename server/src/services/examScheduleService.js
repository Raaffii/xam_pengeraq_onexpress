const pool = require("../config/db");

const Students = require("../models/studentModel");
const StudentExam = require("../models/studentExamModel");

const getExamSchedule = async (page, limit, searchTerm) => {
  try {
    const result = await Students.getStudent(page, limit, searchTerm);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to get student by id");
  }
};

const getStudentById = async (studentId) => {
  try {
    const result = await Students.getStudentById(studentId);

    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to get student by id");
  }
};

const postStudent = async (data, userId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const studentId = await Students.postStudent(connection, data, userId);
    let result;
    if (Array.isArray(data.examSeries) && data.examSeries.length > 0) {
      result = await StudentExam.postStudentExamSeries(
        connection,
        data.examSeries,
        studentId,
        userId
      );
    }
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    console.error("Service error:", error);
    throw error;
  } finally {
    connection.release();
  }
};

const putStudent = async (id, data, userId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await StudentExam.deleteByStudentId(connection, id);
    const result = await Students.putStudent(connection, id, data, userId);

    if (Array.isArray(data.examSeries) && data.examSeries.length > 0) {
      await StudentExam.postStudentExamSeries(
        connection,
        data.examSeries,
        id,
        userId
      );
    }

    await connection.commit();

    return result;
  } catch (error) {
    await connection.rollback();
    console.error("Service error:", error);
    throw error;
  } finally {
    connection.release();
  }
};

const deleteStudent = async (id) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await StudentExam.deleteByStudentId(connection, id);
    const result = await Students.deleteStudent(connection, id);

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    console.error("Service error:", error);
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  getExamSchedule,
  postStudent,
  putStudent,
  deleteStudent,
  getStudentById,
};
