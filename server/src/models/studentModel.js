const pool = require("../config/db");

const getStudent = async (page, limit, searchTerm = "") => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const offset = (page - 1) * limit;

  const searchValue = searchTerm ? `%${searchTerm}%` : "%";

  const studentIdQuery = `
    SELECT studentid
    FROM students
    WHERE studentname LIKE ?
    ORDER BY createddate DESC
    LIMIT ? OFFSET ?
  `;

  const [studentIds] = await pool.query(studentIdQuery, [
    searchValue,
    limit,
    offset,
  ]);

  if (studentIds.length === 0) {
    return { data: [], total: 0 };
  }

  const ids = studentIds.map((row) => row.studentid);

  const detailQuery = `
    SELECT
      s.studentid AS studentId,
      s.studentname AS studentName,
      s.studentidno AS studentIdNo,
      se.examseriesid AS examSeriesId,
      es.examseriesdescription AS examSeriesDescription
    FROM students s
    LEFT JOIN studentexamseries se
      ON s.studentid = se.studentid
    LEFT JOIN examseries es
      ON se.examseriesid = es.examseriesid
    WHERE s.studentid IN (?)
    ORDER BY s.createddate DESC
  `;

  const [rows] = await pool.query(detailQuery, [ids]);

  const map = new Map();

  rows.forEach((row) => {
    if (!map.has(row.studentId)) {
      map.set(row.studentId, {
        studentId: row.studentId,
        studentName: row.studentName,
        studentIdNo: row.studentIdNo,
        examSeries: [],
      });
    }

    if (row.examSeriesId) {
      map.get(row.studentId).examSeries.push({
        examSeriesId: row.examSeriesId,
        examSeriesDescription: row.examSeriesDescription,
      });
    }
  });

  const formattedRows = Array.from(map.values());

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM students
    WHERE studentname LIKE ?
  `;

  const [countResult] = await pool.query(countQuery, [searchValue]);
  const total = countResult[0].total;

  return {
    data: formattedRows,
    total,
  };
};

const getStudentById = async (studentId) => {
  const query = `
    SELECT 
    s.studentid as studentId,
    s.studentname as studentName,
    s.studentidno as studentIdNo,
    s.examseriesid as examSeriesId
 
    FROM students s 
    WHERE s.studentid = ?`;
  const [rows] = await pool.query(query, [studentId]);

  return { data: rows[0] };
};

const postStudent = async (conn, data, userId) => {
  const { studentName, studentIdNo, examSeriesId } = data;

  try {
    const sql =
      "INSERT INTO students (studentname, studentidno, examseriesid, createdby) VALUES (?, ?,?,?)";
    const [result] = await conn.query(sql, [
      studentName,
      studentIdNo,
      null,
      userId,
    ]);
    return result.insertId;
  } catch (err) {
    throw err;
  }
};

const putStudent = async (conn, id, data, userId) => {
  const { studentName, studentIdNo } = data;
  try {
    const sql = ` UPDATE students SET studentname = ?, studentidno = ?, examseriesid = ?, editedby=?, editeddate=? WHERE studentid = ? ;`;
    const [result] = await conn.query(sql, [
      studentName,
      studentIdNo,
      null,
      userId,
      new Date(),
      id,
    ]);
    return result;
  } catch (err) {
    throw err;
  }
};

const deleteStudent = async (conn, id) => {
  try {
    const sql = `DELETE FROM students WHERE studentid = ?;`;
    const [result] = await conn.query(sql, [id]);
    return result;
  } catch (err) {
    throw err;
  }
};
module.exports = {
  getStudent,
  postStudent,
  putStudent,
  deleteStudent,
  getStudentById,
};
