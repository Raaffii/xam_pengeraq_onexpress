const pool = require("../config/db");

const ExamResultModel = {
  async getExamResult(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = "",
      studentId,
      byExamSeriesId,
    } = options;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];
    const params = [];

    if (search) {
      conditions.push("(es.subjcode LIKE ? OR es.subjdesc LIKE ?)");
      const searchValue = `%${search}%`;
      params.push(searchValue, searchValue);
    }

    if (byExamSeriesId) {
      conditions.push("er.examseriesid = ?");
      params.push(byExamSeriesId);
    }

    if (studentId) {
      conditions.push("er.studentid = ?");
      params.push(studentId);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT 
        er.examresultsid as examResultsId,
        er.marks as marks,
        er.subjgpa as subjGpa,
        er.subjgrade as subjGrade,
        er.subjresults as subjResults,
        er.retake as retake,
        es.subjcode as subjCode,
        es.subjdesc as subjDesc,
        es.examsubjid as examSubjId,
        esr.examseriesdescription as examSeriesDescription
      FROM examresults er 
      LEFT JOIN examsubj es ON er.examsubjid = es.examsubjid
      LEFT JOIN examseries esr ON er.examseriesid = esr.examseriesid
      ${whereClause}
      ORDER BY er.createddate DESC
      LIMIT ? OFFSET ?`;

    const [rows] = await pool.query(query, [...params, limitNum, offset]);

    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM examresults er 
      LEFT JOIN examsubj es ON er.examsubjid = es.examsubjid 
      ${whereClause}`;

    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0].total;

    return { data: rows, total };
  },

  async postExamResult(data) {
    const {
      examSeriesId,
      examSubjId,
      studentId,
      marks,
      subjGpa,
      subjGrade,
      subjResults,
      retake,
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
        retake,
        subjGpa,
        subjGrade,
        subjResults,
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
    const { marks, subjGpa, subjGrade, subjResults, retake } = data;
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
    if (retake !== undefined) {
      fields.push("retake = ?");
      params.push(retake);
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
