const pool = require("../config/db");

const getStudentClass = async (page, limit, searchTerm = "", schedule) => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const offset = (page - 1) * limit;

  // const searchValue = `%${searchTerm}%`;

  const conditions = [];
  const params = [];

  const query = `
    SELECT 
    s.studentname as studentName,
    sc.studentclassid as studentClassId,
    s.studentidno as studentIdNo

    FROM studentclass sc 
    LEFT JOIN students s ON sc.studentid = s.studentid
    LEFT JOIN classschhd ch ON sc.classschhdid= ch.classschhdid

    WHERE sc.classschhdid = ?

    LIMIT ? OFFSET ?`;
  const [rows] = await pool.query(query, [schedule, limit, offset]);

  const countQuery = `SELECT COUNT(*) AS total FROM studentclass s WHERE s.classschhdid=?`;
  const [countResult] = await pool.query(countQuery, [schedule]);
  const total = countResult[0].total;

  return { data: rows, total };
};

const postStudentClass = async (data, userId) => {
  console.log("data", data);

  try {
    const values = data.map((item) => [item.studentId, item.scheduleId]);

    const placeholders = data.map(() => "(?, ?)").join(", ");

    const sql = `INSERT INTO studentclass (studentid, classschhdid) VALUES ${placeholders}`;

    const flatValues = values.flat();
    const [result] = await pool.query(sql, flatValues);

    return result.insertId;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getStudentClass,
  postStudentClass,
};
