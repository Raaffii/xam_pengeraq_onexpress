const pool = require("../config/db");

const getExam = async (page, limit, searchTerm = "") => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const offset = (page - 1) * limit;

  const searchValue = `%${searchTerm}%`;

  const query = `
    SELECT 
    e.examname as examName, 
    e.examdescription as examDescription, 
    e.examid as examId
    FROM exam e 
    WHERE e.examname LIKE ? OR e.examdescription LIKE ?
    ORDER BY e.createddate DESC
    LIMIT ? OFFSET ?`;
  const [rows] = await pool.query(query, [
    searchValue,
    searchValue,
    limit,
    offset,
  ]);

  const countQuery = `SELECT COUNT(*) AS total FROM exam e WHERE e.examname LIKE ? OR e.examdescription LIKE ?`;
  const [countResult] = await pool.query(countQuery, [
    searchValue,
    searchValue,
  ]);
  const total = countResult[0].total;

  return { data: rows, total };
};

const postExam = async (data) => {
  const { examName, examDescription } = data;

  try {
    const sql = "INSERT INTO exam (examname, examdescription) VALUES (?, ?)";
    const [result] = await pool.query(sql, [examName, examDescription]);
    return result;
  } catch (err) {
    throw err;
  }
};

const putExam = async (id, data) => {
  const { examName, examDescription } = data;

  try {
    const sql = ` UPDATE exam SET examname = ?, examdescription = ? WHERE examid = ? ;`;
    const [result] = await pool.query(sql, [examName, examDescription, id]);
    return result;
  } catch (err) {
    throw err;
  }
};

const deleteExam = async (id) => {
  try {
    const sql = `DELETE FROM exam WHERE examid = ?;`;
    const [result] = await pool.query(sql, [id]);
    return result;
  } catch (err) {
    throw err;
  }
};
module.exports = { getExam, postExam, putExam, deleteExam };
