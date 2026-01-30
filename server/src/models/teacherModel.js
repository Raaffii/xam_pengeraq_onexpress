const pool = require("../config/db");

const getTeacher = async (options = {}) => {
  let { page = 1, limit = 10, searchTerm = "" } = options;

  const params = [];
  const conditions = [];

  if (searchTerm) {
    const searchValue = searchTerm ? `%${searchTerm}%` : "%";
    conditions.push("t.teachername LIKE ?");
    params.push(searchValue);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  let query = `
    SELECT 
    t.teachername as teacherName,
    t.emailaddress as teacherEmail,
    t.teacherid as teacherId

    FROM teacher t 
     ${whereClause} 
    ORDER BY t.createddate DESC
    `;
  const queryParams = [...params];
  if (page && limit) {
    const offset = (page - 1) * limit;
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(String(limit), String(offset));
  }

  const [rows] = await pool.execute(query, queryParams);
  const countQuery = `SELECT COUNT(*) AS total  FROM teacher t ${whereClause} `;
  const [countResult] = await pool.execute(countQuery, [...params]);
  const total = countResult[0].total;

  return { data: rows, total: total };
};

const getTeacherById = async (id) => {
  const query = `
    SELECT 
    t.teachername as teacherName,
    t.emailaddress as emailAddress,
    t.teacherid as teacherId,
    s.name as userName

    FROM teacher t 
    LEFT JOIN users s ON t.teacherid = s.teacherid
    
    WHERE t.teacherid = ?`;
  const [rows] = await pool.execute(query, [id]);

  return { data: rows[0] };
};

const postTeacher = async (data) => {
  const { teacherName, teacherEmail, enteredBy } = data;
  const query = `INSERT INTO teacher (teachername, emailaddress, createdby, createddate) VALUES (?, ?,?,?)`;
  const [rows] = await pool.execute(query, [
    teacherName,
    teacherEmail,
    enteredBy,
    new Date(),
  ]);

  return rows.insertId;
};

const putTeacher = async (data, id) => {
  const { teacherName, teacherEmail, editedBy } = data;
  const fields = [];
  const params = [];

  if (teacherName) {
    fields.push("teachername = ?");
    params.push(teacherName);
  }

  if (teacherEmail) {
    fields.push("emailaddress = ?");
    params.push(teacherEmail);
  }
  fields.push("editedby = ?");
  params.push(editedBy);

  fields.push("editeddate = NOW()");

  const sql = `
      UPDATE teacher
      SET ${fields.join(", ")}
      WHERE teacherid = ?
    `;

  params.push(id);

  const [result] = await pool.execute(sql, params);

  return { data: result };
};

const deleteTeacher = async (id) => {
  try {
    const query = `
    DELETE FROM teacher
    WHERE teacherid = ?
  `;

    const [rows] = await pool.execute(query, [id]);

    return { data: rows };
  } catch (err) {
    throw err;
  }
};

const findByEmail = async (teacherEmail) => {
  const [rows] = await pool.query(
    `SELECT teacherid, emailaddress As emailAddress, active
     FROM teacher WHERE emailaddress = ?`,
    [teacherEmail],
  );
  return rows[0];
};

module.exports = {
  getTeacher,
  postTeacher,
  putTeacher,
  getTeacherById,
  deleteTeacher,
  findByEmail,
};
