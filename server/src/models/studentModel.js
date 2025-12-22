const pool = require("../config/db");

const getStudent = async (page, limit, search = "") => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const offset = (page - 1) * limit;

  const searchValue = `%${search}%`;

  const query = `
    SELECT s.*, es.examseriesdescription as currentexamseries
    FROM students s 
    LEFT JOIN examseries es ON s.examseriesid=es.examseriesid
    WHERE studentname LIKE ?
    LIMIT ? OFFSET ?`;
  const [rows] = await pool.query(query, [searchValue, limit, offset]);

  const countQuery = `SELECT COUNT(*) AS total FROM students WHERE studentname LIKE ?`;
  const [countResult] = await pool.query(countQuery, [searchValue]);
  const total = countResult[0].total;

  return { data: rows, total };
};

module.exports = { getStudent };
