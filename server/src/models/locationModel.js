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

  const [rows] = await pool.execute(query, [
    ...params,
    String(limit),
    String(offset),
  ]);
  const countQuery = `SELECT COUNT(*) AS total  FROM classlocation cl ${whereClause} `;
  const [countResult] = await pool.execute(countQuery, [...params]);
  const total = countResult[0].total;

  return { data: rows, total: total };
};

const getLocationById = async (id) => {
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
  return { data: rows[0] };
};

const postLocation = async (data) => {
  const { locationName, createdBy } = data;
  const query = `INSERT INTO classlocation (locationname, createdby, createddate) VALUES (?,?,?)`;
  const [rows] = await pool.execute(query, [
    locationName,
    createdBy,
    new Date(),
  ]);

  return rows.insertId;
};

const putLocation = async (data, id) => {
  const { locationName, editedBy } = data;
  const fields = [];
  const params = [];

  if (locationName !== undefined) {
    fields.push("locationname = ?");
    params.push(locationName);
  }

  fields.push("editedby = ?");
  params.push(editedBy);

  fields.push("editeddate = NOW()");

  const sql = `
      UPDATE classlocation 
      SET ${fields.join(", ")} 
      WHERE classlocationid = ?
    `;
  params.push(id);

  const [rows] = await pool.execute(sql, params);

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
