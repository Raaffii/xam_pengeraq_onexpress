const pool = require("../config/db");
const ExamSeries = require("../models/examSeriesModel");

const ExamSeriesService = {
  async getExamSeries(page, pageSize, searchTerm, byExam, examId) {
    return await ExamSeries.getSeries(
      page,
      pageSize,
      searchTerm,
      byExam,
      examId,
    );
  },

  async getExamSeriesById(examSeriesById) {
    const result = await ExamSeries.getSeriesById(examSeriesById);

    if (!result || !result.data || result.data.length === 0) {
      throw new Error("Exam Series not found");
    }

    return result;
  },

  async postExamSeries(data) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      if (data.examId) {
        const examQuery = `
          SELECT examid 
          FROM exam
          WHERE examid = ? AND active = 1
        `;
        const [examResult] = await conn.execute(examQuery, [data.examId]);

        if (examResult.length === 0) {
          await conn.rollback();
          throw new Error("Exam not found or inactive");
        }
      }

      const newSeriesId = await ExamSeries.postSeries(conn, data);

      await conn.commit();

      return await this.getExamSeriesById(newSeriesId);
    } catch (error) {
      await conn.rollback();
      console.error("Service error:", error);
      throw error;
    } finally {
      conn.release();
    }
  },

  async putExamSeries(id, data) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      if (data.examId) {
        const examQuery = `
          SELECT examid 
          FROM exam
          WHERE examid = ? AND active = 1
        `;
        const [examResult] = await conn.execute(examQuery, [data.examId]);

        if (examResult.length === 0) {
          await conn.rollback();
          throw new Error("Exam not found or inactive");
        }
      }

      const result = await ExamSeries.putSeries(conn, id, data);

      if (!result) {
        throw new Error("Exam Series not found or update failed");
      }

      return await this.getExamSeriesById(id);
    } catch (error) {
      await conn.rollback();
      console.error("Service error:", error);
      throw error;
    } finally {
      conn.release();
    }
  },

  async deleteExamSeries(data) {
    try {
      const result = await ExamSeries.deleteSeries(data);

      if (result.affectedRows === 0) {
        throw new Error("Exam Series not found");
      }

      return result;
    } catch (error) {
      console.error("Service error:", error);
      throw error;
    }
  },
};

module.exports = ExamSeriesService;
