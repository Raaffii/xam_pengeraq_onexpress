const pool = require("../config/db");
const EFG = require("../models/examFinalGradeModel");

const finalGradeService = {
  async getAllGrades(options = {}) {
    return await EFG.fetch(options);
  },
  async findById(gradeId) {
    return await EFG.findById(gradeId);
  },
  async newGrade(data) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      if (data.seriesId) {
        const seriesQuery = `
          SELECT examseriesid 
          FROM examseries 
          WHERE examseriesid = ? AND active = 1
        `;
        const [seriesResult] = await conn.execute(seriesQuery, [data.seriesId]);

        if (seriesResult.length === 0) {
          throw new Error("Exam series not found or inactive");
        }
      }

      const gradeId = await EFG.insert(conn, data);

      await conn.commit();
      return await this.findById(gradeId);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
  async updateFGrade(data) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      if (data.seriesId) {
        const seriesQuery = `
          SELECT examseriesid 
          FROM examseries 
          WHERE examseriesid = ? AND active = 1
        `;
        const [seriesResult] = await conn.execute(seriesQuery, [data.seriesId]);

        if (seriesResult.length === 0) {
          throw new Error("Exam series not found or inactive");
        }
      }

      const result = await EFG.updateGrade(conn, data);
      if (!result) {
        throw new Error("Grade not found");
      }

      await conn.commit();

      return this.findById(data.gradeId);
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },
  async deleteFGrade(data) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const grade = await EFG.findById(data.gradeToDelete);
      if (!grade) {
        throw new Error("Grade not found");
      }

      await EFG.deleteById(conn, data.gradeToDelete);

      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },
};

module.exports = finalGradeService;
