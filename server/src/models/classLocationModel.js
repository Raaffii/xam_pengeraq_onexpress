const pool = require("../config/db");

const getCLassLocation = async () => {
  // page = Number(page) || 1;
  // limit = Number(limit) || 10;
  // const offset = (page - 1) * limit;

  // const searchValue = `%${searchTerm}%`;

  const query = `
    SELECT 
    cl.classlocationid as classLocationId,
    cl.locationname as locationName
    FROM classlocation cl`;
  const [rows] = await pool.query(query);
  //  const [rows] = await pool.query(query, [searchValue, limit, offset]);
  // const countQuery = `SELECT COUNT(*) AS total FROM studentexamseries `;
  // const [countResult] = await pool.query(countQuery, [searchValue]);
  // const total = countResult[0].total;

  return { data: rows };
};

module.exports = {
  getCLassLocation,
};
