const pool = require("../config/db");

const getLocation = async (options = {}) => {
  let { page = 1, limit = 10, searchTerm } = options;
  const offset = (page - 1) * limit;

  const params = [];
  const conditions = [];

  if (searchTerm) {
    const searchValue = searchTerm ? `%${searchTerm}%` : "%";
    conditions.push("cl.locationname LIKE ?");
    params.push(searchValue);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const query = `
    SELECT 
    cl.locationname as locationName,
    cl.classlocationid as classLocationId
    FROM classlocation cl 
     ${whereClause}
    LIMIT ? OFFSET ?
    `;

  const [rows] = await pool.execute(query, [...params, limit, offset]);
  const countQuery = `SELECT COUNT(*) AS total  FROM classlocation cl ${whereClause} `;
  const [countResult] = await pool.execute(countQuery, [...params]);
  const total = countResult[0].total;

  return { data: rows, total: total };
};

const getLocationById = async (id) => {
  // page = Number(page) || 1;
  // limit = Number(limit) || 10;
  // const offset = (page - 1) * limit;

  // const searchValue = `%${searchTerm}%`;

  const query = `
    SELECT 
    t.Locationname as LocationName,
    t.emailaddress as emailAddress,
    t.Locationid as LocationId,
    s.name as userName

    FROM Location t 
    LEFT JOIN users s ON t.Locationid = s.Locationid
    
    WHERE t.Locationid = ?`;
  const [rows] = await pool.query(query, [id]);
  //  const [rows] = await pool.query(query, [searchValue, limit, offset]);
  // const countQuery = `SELECT COUNT(*) AS total FROM studentexamseries `;
  // const [countResult] = await pool.query(countQuery, [searchValue]);
  // const total = countResult[0].total;

  return { data: rows[0] };
};

const postLocation = async (data) => {
  const { locationName, createdBy } = data;
  const query = `INSERT INTO classlocation (locationname, createdby, createddate) VALUES (?,?,?)`;
  const [rows] = await pool.query(query, [locationName, createdBy, new Date()]);

  return rows.insertId;
};

const putLocation = async (data, id) => {
  const { locationName, editedBy } = data;
  const query = `
    UPDATE classlocation 
    SET locationname = ?, editedby = ?, editeddate=?
    WHERE classlocationid = ?
  `;

  const [rows] = await pool.query(query, [
    locationName,
    editedBy,
    new Date(),
    id,
  ]);

  return { data: rows };
};

const deleteLocation = async (id) => {
  try {
    const query = `
    DELETE FROM classlocation
    WHERE classlocationid = ?
  `;
    const [rows] = await pool.query(query, [id]);

    return { data: rows };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getLocation,
  postLocation,
  putLocation,
  getLocationById,
  deleteLocation,
};
