const SubjModel = require("../models/subjModel");
const pool = require("../config/db");
const { defaultExamFinalGrades } = require("../utils/data");

const subjService = {
  async getAllSubjs(options = {}) {
    return await SubjModel.findAll(options);
  },

  async newSubj(data) {
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

      const duplicateQuery = `
        SELECT examsubjid 
        FROM examsubj 
        WHERE LOWER(subjcode) = LOWER(?) AND active = 1
      `;
      const [duplicateResult] = await conn.execute(duplicateQuery, [
        data.subjCode,
      ]);

      if (duplicateResult.length > 0) {
        throw new Error("Subject code already exists");
      }

      // Create new subject
      const subjId = await SubjModel.createSubject(conn, {
        subjCode: data.subjCode,
        subjDesc: data.subjDesc,
        subjCredit: data.subjCredit,
        examseriesId: data.seriesId || null,
        enteredBy: data.enteredBy,
      });

      // Insert default subject grades
      await SubjModel.insertSubjGrade(conn, {
        examsubjid: subjId,
        examseriesid: data.seriesId || null,
        grades: defaultExamFinalGrades,
      });

      await conn.commit();

      // Fetch and return the created subject details
      return await this.fetchSubjDetails(subjId);
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },

  async updateSubj(data) {
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

      if (data.subjCode) {
        const duplicateQuery = `
          SELECT examsubjid 
          FROM examsubj 
          WHERE LOWER(subjcode) = LOWER(?) 
          AND examsubjid != ? 
          AND active = 1
        `;
        const [duplicateResult] = await conn.execute(duplicateQuery, [
          data.subjCode,
          data.subjId,
        ]);

        if (duplicateResult.length > 0) {
          throw new Error("Subject code already exists");
        }
      }

      const result = await SubjModel.putSubj(conn, data);
      if (!result) {
        throw new Error("Subject not found");
      }

      await conn.commit();

      return this.fetchSubjDetails(data.subjId);
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },

  async deleteSubj(data) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const subj = await SubjModel.fetchSubjById(data.subjToDelete);
      if (!subj) {
        throw new Error("Subject not found");
      }

      await SubjModel.softDeleteSubj(conn, data);

      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },

  async fetchSubjDetails(subjId) {
    const subj = await SubjModel.fetchSubjById(subjId);

    if (!subj) {
      throw new Error("Subject not found");
    }

    return subj;
  },
};

module.exports = subjService;
