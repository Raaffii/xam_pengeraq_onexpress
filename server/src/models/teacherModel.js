const pool = require("../config/db");

const getTeacher = async () => {
  // page = Number(page) || 1;
  // limit = Number(limit) || 10;
  // const offset = (page - 1) * limit;

  // const searchValue = `%${searchTerm}%`;

  const query = `
    SELECT 
    t.teachername as teacherName,
    t.emailaddress as emailAddress,
    t.teacherid as teacherId
    FROM teacher t`;
  const [rows] = await pool.query(query);
  //  const [rows] = await pool.query(query, [searchValue, limit, offset]);
  // const countQuery = `SELECT COUNT(*) AS total FROM studentexamseries `;
  // const [countResult] = await pool.query(countQuery, [searchValue]);
  // const total = countResult[0].total;

  return { data: rows };
};

module.exports = {
  getTeacher,
};
