const pool = require("../config/db");

const getStudentExam = async (page, limit, searchTerm = "") => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const offset = (page - 1) * limit;

  const searchValue = `%${searchTerm}%`;

  const query = `
    SELECT 
    se.studentid as studentId,
    se.examseriesid as examSeriesId, 
    e.examseriesdescription as examSeriesDescription
    FROM studentexamseries se 
    LEFT JOIN examseries e ON se.examseriesid = e.examseriesid
    ORDER BY s.createddate DESC
    LIMIT ? OFFSET ?`;
  const [rows] = await pool.query(query, [searchValue, limit, offset]);

  const countQuery = `SELECT COUNT(*) AS total FROM studentexamseries `;
  const [countResult] = await pool.query(countQuery, [searchValue]);
  const total = countResult[0].total;

  return { data: rows, total };
};

const getStudentExamById = async (studentId) => {
  const query = `
    SELECT 
    se.studentid as studentId,
    se.examseriesid as examSeriesId,
    e.examseriesdescription as examSeriesDescription
    FROM studentexamseries se 
    LEFT JOIN examseries e ON se.examseriesid = e.examseriesid
    WHERE se.studentid = ?`;
  const [rows] = await pool.query(query, [studentId]);

  return { data: rows };
};

const postStudentExamSeries = async (examSeriesId, studentId) => {
  const sql =
    "INSERT INTO studentexamseries (studentid, examseriesid) VALUES (?, ?)";
  const [result] = await pool.query(sql, [studentId, examSeriesId]);
  return result;
};

module.exports = {
  getStudentExam,
  getStudentExamById,
  postStudentExamSeries,
};
