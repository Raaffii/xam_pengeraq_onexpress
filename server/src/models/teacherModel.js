const pool = require("../config/db");

const getTeacher = async (page, limit, searchTerm = "") => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const offset = (page - 1) * limit;

  const params = [];
  const conditions = [];

  if (searchTerm) {
    const searchValue = searchTerm ? `%${searchTerm}%` : "%";
    conditions.push("t.teachername LIKE ?");
    params.push(searchValue);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const query = `
    SELECT 
    t.teachername as teacherName,
    t.emailaddress as emailAddress,
    t.teacherid as teacherId,
    s.name as userName,
    s.userid as userId

    FROM teacher t 
    LEFT JOIN users s ON t.teacherid = s.teacherid
    
     ${whereClause}
    LIMIT ? OFFSET ?
    `;

  const [rows] = await pool.query(query, [...params, limit, offset]);
  const countQuery = `SELECT COUNT(*) AS total  FROM teacher t ${whereClause} `;
  const [countResult] = await pool.query(countQuery, [...params]);
  const total = countResult[0].total;

  return { data: rows, total: total };
};

const getTeacherById = async (id) => {
  // page = Number(page) || 1;
  // limit = Number(limit) || 10;
  // const offset = (page - 1) * limit;

  // const searchValue = `%${searchTerm}%`;

  const query = `
    SELECT 
    t.teachername as teacherName,
    t.emailaddress as emailAddress,
    t.teacherid as teacherId,
    s.name as userName

    FROM teacher t 
    LEFT JOIN users s ON t.teacherid = s.teacherid
    
    WHERE t.teacherid = ?`;
  const [rows] = await pool.query(query, [id]);
  //  const [rows] = await pool.query(query, [searchValue, limit, offset]);
  // const countQuery = `SELECT COUNT(*) AS total FROM studentexamseries `;
  // const [countResult] = await pool.query(countQuery, [searchValue]);
  // const total = countResult[0].total;

  return { data: rows[0] };
};

const postTeacher = async (data) => {
  const { teacherName, teacherEmail } = data;
  const query = `INSERT INTO teacher (teachername, emailaddress) VALUES (?, ?)`;
  const [rows] = await pool.query(query, [teacherName, teacherEmail]);

  return rows.insertId;
};

const putTeacher = async (data, id) => {
  const { teacherName, teacherEmail } = data;

  const query = `
    UPDATE teacher 
    SET teachername = ?, emailaddress = ?
    WHERE teacherid = ?
  `;

  const [rows] = await pool.query(query, [teacherName, teacherEmail, id]);

  return { data: rows };
};

const deleteTeacher = async (id) => {
  const query = `
    DELETE FROM teacher
    WHERE teacherid = ?
  `;

  const [rows] = await pool.query(query, [id]);

  return { data: rows };
};

module.exports = {
  getTeacher,
  postTeacher,
  putTeacher,
  getTeacherById,
  deleteTeacher,
};
