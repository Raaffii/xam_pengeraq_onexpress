const pool = require("../config/db");
const Students = require("../models/studentModel");
const StudentExam = require("../models/studentExamModel");

const getStudent = async (page, limit, searchTerm) => {
  return await Students.getStudent(page, limit, searchTerm);
};

const getStudentById = async (studentId) => {
  const result = await Students.getStudentById(studentId);
  if (!result) {
    throw new Error("Student not found");
  }

  return result;
};

const postStudent = async (data, userId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const studentId = await Students.postStudent(connection, data, userId);
    let result;
    if (Array.isArray(data.examSeries) && data.examSeries.length > 0) {
      result = await StudentExam.postStudentExam(connection, {
        examSeriesIds: data.examSeries,
        studentId,
        userId,
      });
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
      await StudentExam.postStudentExam(connection, {
        examSeriesIds: data.examSeries,
        studentId: id,
        userId,
      });
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
  getStudent,
  postStudent,
  putStudent,
  deleteStudent,
  getStudentById,
};
