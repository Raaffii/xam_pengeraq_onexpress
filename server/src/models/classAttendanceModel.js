const pool = require("../config/db");

const getClassAttendance = async (
  page,
  limit,
  searchTerm = "",
  filter = {},
) => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const offset = (page - 1) * limit;

  console.log(page, limit, searchTerm);

  // const searchValue = `%${searchTerm}%`;
  const { classSchDetailsId } = filter;

  const conditions = [];
  const params = [];

  if (searchTerm) {
    const searchValue = `%${searchTerm}%`;
    conditions.push("s.studentname LIKE ?");
    params.push(searchValue);
  }

  if (classSchDetailsId) {
    conditions.push("csd.classschdetailsid=?");
    params.push(classSchDetailsId);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  let query = `
    SELECT 
    s.studentname AS studentName,
    s.studentidno AS studentIdNo,
    
    (sa.attend IS NOT NULL) AS attend,
    sa.checkindatetime AS checkInDateTime
    FROM studentclass sc
    LEFT JOIN classschdetails csd 
    ON sc.classschhdid = csd.classschhdid
    LEFT JOIN studattendstat sa 
    ON csd.classschdetailsid = sa.classschdetailsid
    AND sc.studentid = sa.studentid
    LEFT JOIN students s 
    ON sc.studentid = s.studentid
    ${whereClause}
    ORDER BY sa.checkindatetime DESC`;

  const queryParams = [...params];

  if (page && limit) {
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);
  }

  const [rows] = await pool.execute(query, queryParams);

  const countQuery = `SELECT COUNT(*) AS total FROM studentclass sc
    LEFT JOIN classschdetails csd 
    ON sc.classschhdid = csd.classschhdid
    LEFT JOIN studattendstat sa 
    ON csd.classschdetailsid = sa.classschdetailsid
    AND sc.studentid = sa.studentid
    LEFT JOIN students s 
    ON sc.studentid = s.studentid ${whereClause}`;
  const [countResult] = await pool.query(countQuery, params);
  const total = countResult[0].total;

  return { data: rows, total };
};

const deleteClassAtendance = async (conn, id) => {
  try {
    const sql = `DELETE FROM studattendstat WHERE classschhdid  = ?;`;
    const [result] = await conn.query(sql, [id]);
    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getClassAttendance,
  deleteClassAtendance,
};
