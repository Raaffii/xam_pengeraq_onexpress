const pool = require("../config/db");
const StudentExamModel = require("../models/studentExamModel");

const StudentExamService = {
  async getStudentExam(options = {}) {
    return await StudentExamModel.getStudentExam(options);
  },

  async getStudentExamByStudentId(studentId) {
    return await StudentExamModel.getStudentExamByStudentId(studentId);
  },

  async deleteStudentExam(studentId) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const result = await StudentExamModel.deleteByStudentId(conn, studentId);

      if (result.affectedRows === 0) {
        throw new Error("No exam series found for this student");
      }

      return {
        success: true,
      };
    } catch (error) {
      await conn.rollback();
      console.error("Service error:", error);
      throw error;
    } finally {
      conn.release();
    }
  },

  async deleteStudentExamById(studentExamId) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const result = await StudentExamModel.deleteByExamId(conn, studentExamId);

      if (result.affectedRows === 0) {
        throw new Error("No exam series found for this student");
      }

      return {
        success: true,
      };
    } catch (error) {
      await conn.rollback();
      console.error("Service error:", error);
      throw error;
    } finally {
      conn.release();
    }
  },
};

module.exports = StudentExamService;
