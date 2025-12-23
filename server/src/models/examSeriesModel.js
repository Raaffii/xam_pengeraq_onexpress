const pool = require("../config/db");

const getExamSeries = async (page, limit, search = "") => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const offset = (page - 1) * limit;

  const searchValue = `%${search}%`;

  const query = `
    SELECT es.* 
    FROM examseries es `;
  const [rows] = await pool.query(query, [searchValue]);

  return { data: rows, total: 10 };
};

module.exports = { getExamSeries };
