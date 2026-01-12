const pool = require("../config/db");

const getStudentClass = async (page, limit, searchTerm = "", schedule) => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const offset = (page - 1) * limit;

  // const searchValue = `%${searchTerm}%`;

  const conditions = [];
  const params = [];

  console.log("schedule", schedule);
  const query = `
    SELECT 
    s.studentname as studentName,
    sc.studentclassid as studentClassId

    FROM studentclass sc 
    LEFT JOIN students s ON sc.studentid = s.studentid
    LEFT JOIN classschhd ch ON sc.classschhdid= ch.classschhdid

    WHERE sc.classschhdid = ?

    LIMIT ? OFFSET ?`;
  const [rows] = await pool.query(query, [schedule, limit, offset]);

  const countQuery = `SELECT COUNT(*) AS total FROM studentclass sc`;
  const [countResult] = await pool.query(countQuery);
  const total = countResult[0].total;

  return { data: rows, total };
};

module.exports = {
  getStudentClass,
};
