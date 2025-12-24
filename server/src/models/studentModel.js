const pool = require("../config/db");

const getStudent = async (page, limit, search = "") => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const offset = (page - 1) * limit;

  const searchValue = `%${search}%`;

  const query = `
    SELECT 
    s.studentid as studentId,
    s.studentname as studentName,
    s.studentidno as studentIdNo,
    s.examseriesid as examSeriesId, 
    es.examseriesdescription as examSeriesDescription
    FROM students s 
    LEFT JOIN examseries es ON s.examseriesid=es.examseriesid
    WHERE studentname LIKE ? ORDER BY s.createddate DESC
    LIMIT ? OFFSET ?`;
  const [rows] = await pool.query(query, [searchValue, limit, offset]);

  const countQuery = `SELECT COUNT(*) AS total FROM students WHERE studentname LIKE ?`;
  const [countResult] = await pool.query(countQuery, [searchValue]);
  const total = countResult[0].total;

  return { data: rows, total };
};

const postStudent = async (data) => {
  const { studentName, studentIdNo, examSeriesId } = data;

  try {
    const sql =
      "INSERT INTO students (studentname, studentidno, examseriesid) VALUES (?, ?,?)";
    const [result] = await pool.query(sql, [
      studentName,
      studentIdNo,
      examSeriesId,
    ]);
    return result;
  } catch (err) {
    throw err;
  }
};

const putStudent = async (id, data) => {
  const { studentName, studentIdNo, examSeriesId } = data;

  try {
    const sql = ` UPDATE students SET studentname = ?, studentidno = ?, examseriesid = ? WHERE studentid = ? ;`;
    const [result] = await pool.query(sql, [
      studentName,
      studentIdNo,
      examSeriesId,
      id,
    ]);
    return result;
  } catch (err) {
    throw err;
  }
};

const deleteStudent = async (id) => {
  try {
    const sql = `DELETE FROM students WHERE studentid = ?;`;
    const [result] = await pool.query(sql, [id]);
    return result;
  } catch (err) {
    throw err;
  }
};
module.exports = { getStudent, postStudent, putStudent, deleteStudent };
