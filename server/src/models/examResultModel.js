const pool = require("../config/db");

const ExamResultModel = {
  async getExamResult(options = {}) {
    const { page, pageSize, studentId, searchTerm, byExamSeriesId } = options;

    const conditions = [];
    const params = [];

    if (studentId) {
      conditions.push("er.studentid = ?");
      params.push(studentId);
    }

    if (byExamSeriesId) {
      conditions.push("er.examseriesid = ?");
      params.push(byExamSeriesId);
    }

    conditions.push("er.active = ? AND es.active = ?");
    params.push(1, 1);

    if (searchTerm) {
      conditions.push(
        "(LOWER(es.subjdesc) LIKE ? OR LOWER(es.subjcode) LIKE ?)",
      );
      const searchPattern = `%${searchTerm.toLowerCase()}%`;
      params.push(searchPattern, searchPattern);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM examresults er 
      LEFT JOIN examsubj es ON er.examsubjid = es.examsubjid
      LEFT JOIN examseries esr ON er.examseriesid = esr.examseriesid
      ${whereClause}
    `;
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    // Build base query
    let query = `
      SELECT 
        er.examresultsid as resultId,
        er.studentid as studentId,
        er.examseriesid as seriesId,
        er.examsubjid as subjId,
        er.marks as marks,
        er.subjgpa as subjGpa,
        er.subjgrade as subjGrade,
        er.subjresults as subjResult,
        er.retake as isRetake,
        es.subjcode as subjCode,
        es.subjdesc as subjDesc,
        esr.examseriesdescription as seriesDesc,
        er.createddate as createdDate,
        er.createdby as createdBy
      FROM examresults er 
      LEFT JOIN examsubj es ON er.examsubjid = es.examsubjid
      LEFT JOIN examseries esr ON er.examseriesid = esr.examseriesid
      ${whereClause}
      ORDER BY er.createddate DESC
    `;

    const queryParams = [...params];

    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      query += ` LIMIT ? OFFSET ?`;
      queryParams.push(String(pageSize), String(offset));
    }

    const [rows] = await pool.execute(query, queryParams);

    return {
      data: rows,
      total,
      page: page || null,
      pageSize: pageSize || null,
    };
  },

  async postExamResult(data) {
    const {
      examSeriesId,
      examSubjId,
      studentId,
      marks,
      subjGpa,
      subjGrade,
      subjResult,
      isRetake,
    } = data;

    try {
      const sql = `
        INSERT INTO examresults 
        (examseriesid, examsubjid, studentid, marks, retake, subjgpa, subjgrade, subjresults) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      const [result] = await pool.query(sql, [
        examSeriesId,
        examSubjId,
        studentId,
        marks,
        isRetake,
        subjGpa,
        subjGrade,
        subjResult,
      ]);

      return result;
    } catch (err) {
      throw err;
    }
  },

  async checkExamResult(data) {
    const { examSeriesId, examSubjId, studentId } = data;

    try {
      const sql = `
        SELECT * 
        FROM examresults er 
        WHERE er.examseriesid = ? 
          AND er.examsubjid = ? 
          AND er.studentid = ?`;

      const [result] = await pool.query(sql, [
        examSeriesId,
        examSubjId,
        studentId,
      ]);

      return result;
    } catch (err) {
      throw err;
    }
  },

  async putExamResult(id, data) {
    const { marks, subjGpa, subjGrade, subjResults, isRetake } = data;
    const fields = [];
    const params = [];

    if (marks !== undefined) {
      fields.push("marks = ?");
      params.push(marks);
    }
    if (subjGpa !== undefined) {
      fields.push("subjgpa = ?");
      params.push(subjGpa);
    }
    if (subjGrade !== undefined) {
      fields.push("subjgrade = ?");
      params.push(subjGrade);
    }
    if (subjResults !== undefined) {
      fields.push("subjresults = ?");
      params.push(subjResults);
    }
    if (isRetake !== undefined) {
      fields.push("retake = ?");
      params.push(isRetake);
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    try {
      const sql = `
        UPDATE examresults 
        SET ${fields.join(", ")} 
        WHERE examresultsid = ?`;

      params.push(id);

      const [result] = await pool.query(sql, params);
      return result;
    } catch (err) {
      throw err;
    }
  },

  async deleteExamResult(id) {
    try {
      const sql = `DELETE FROM examresults WHERE examresultsid = ?`;
      const [result] = await pool.query(sql, [id]);
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = ExamResultModel;
