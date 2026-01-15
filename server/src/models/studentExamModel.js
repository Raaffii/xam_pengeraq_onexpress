const pool = require("../config/db");

const StudentExamModel = {
  async getStudentExam(options = {}) {
    const page = options.page ? Number(options.page) : null;
    const pageSize = options.pageSize ? Number(options.pageSize) : null;
    const searchTerm = options.searchTerm || "";
    const bySeries = options.bySeries;

    const conditions = [];
    const params = [];

    if (searchTerm) {
      conditions.push(`(
        s.studentname LIKE ? OR 
        s.studentidno LIKE ? OR 
        e.examseriesdescription LIKE ?
      )`);
      const searchValue = `%${searchTerm}%`;
      params.push(searchValue, searchValue, searchValue);
    }

    if (bySeries) {
      conditions.push(`se.examseriesid = ?`);
      params.push(bySeries);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Main query
    let query = `
      SELECT 
        se.studentexamid as studentExamId,
        se.studentid as studentId,
        s.studentname as studentName,
        s.studentidno as studentIdNo,
        se.examseriesid as seriesId, 
        e.examseriesdescription as seriesDesc,
        se.createddate as createdDate,
        se.createdby as createdBy
      FROM studentexamseries se 
      LEFT JOIN students s ON se.studentid = s.studentid
      LEFT JOIN examseries e ON se.examseriesid = e.examseriesid
      ${whereClause}
      ORDER BY s.studentname DESC`;

    const queryParams = [...params];

    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      query += ` LIMIT ? OFFSET ?`;
      queryParams.push(String(pageSize), String(offset));
    }

    const [rows] = await pool.execute(query, queryParams);

    // Count query
    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM studentexamseries se 
      LEFT JOIN students s ON se.studentid = s.studentid
      LEFT JOIN examseries e ON se.examseriesid = e.examseriesid
      ${whereClause}`;

    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    return { data: rows, total };
  },

  async getStudentExamByStudentId(studentId) {
    const query = `
      SELECT 
        se.studentexamid as studentExamId,
        se.studentid as studentId,
        s.studentname as studentName,
        s.studentidno as studentIdNo,
        se.examseriesid as seriesId,
        e.examseriesdescription as seriesDesc,
        e.examseriesstartdate as seriesStartDate,
        e.examseriesenddate as seriesEndDate,
        se.createddate as createdDate,
        se.createdby as createdBy
      FROM studentexamseries se 
      LEFT JOIN students s ON se.studentid = s.studentid
      LEFT JOIN examseries e ON se.examseriesid = e.examseriesid
      WHERE se.studentid = ?
      ORDER BY e.examseriesstartdate DESC`;

    const [rows] = await pool.execute(query, [studentId]);
    return { data: rows };
  },

  async postStudentExam(conn, data) {
    try {
      const { studentId, examSeriesIds, userId } = data;

      if (!examSeriesIds || examSeriesIds.length === 0) {
        throw new Error("Exam series IDs are required");
      }

      const sql = `
        INSERT INTO studentexamseries 
        (studentid, examseriesid, createdby, createddate) 
        VALUES ?`;

      const values = examSeriesIds.map((seriesId) => [
        studentId,
        seriesId,
        userId,
        new Date(),
      ]);

      const [result] = await conn.query(sql, [values]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  async deleteByStudentId(conn, studentId) {
    try {
      const sql = `DELETE FROM studentexamseries WHERE studentid = ?`;
      const [result] = await conn.query(sql, [studentId]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  async deleteByExamId(conn, studentExamId) {
    try {
      const sql = `DELETE FROM studentexamseries WHERE studentexamid = ?`;
      const [result] = await conn.query(sql, [studentExamId]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  async checkExists(conn, studentId, examSeriesId) {
    const query = `
      SELECT COUNT(*) as count 
      FROM studentexamseries 
      WHERE studentid = ? AND examseriesid = ?`;

    const [rows] = await conn.query(query, [studentId, examSeriesId]);
    return rows[0].count > 0;
  },
};

module.exports = StudentExamModel;
