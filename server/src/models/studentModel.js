const pool = require("../config/db");

const getStudent = async (options = {}) => {
  const {
    page = 1,
    pageSize = 10,
    enrolledClass,
    searchTerm,
    enrolledSelected,
  } = options;

  const conditions = [];
  const params = [];

  if (enrolledSelected === "SELECTED") {
    conditions.push("sc.classschhdid = ? ");
    params.push(enrolledClass);
  }

  if (searchTerm) {
    const searchValue = `%${searchTerm}%`;
    conditions.push("s.studentname LIKE ?");
    params.push(searchValue);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  let studentIdQuery = `
  SELECT DISTINCT s.studentid
  FROM students s
  LEFT JOIN studentclass sc
  ON s.studentid = sc.studentid
  ${whereClause}
  `;

  const queryParams = [...params];

  const offset = (page - 1) * pageSize;
  studentIdQuery += ` LIMIT ? OFFSET ?`;
  queryParams.push(pageSize, offset);

  const [studentIds] = await pool.query(studentIdQuery, queryParams);

  if (studentIds.length === 0) {
    return { data: [], total: 0 };
  }

  const ids = studentIds.map((row) => row.studentid);

  let orderBy = "ORDER BY s.createddate DESC";
  const orderParams = [];

  const detailQuery = `
    SELECT
      s.studentid AS studentId,
      s.studentname AS studentName,
      s.studentidno AS studentIdNo,

      se.examseriesid AS examSeriesId,
      es.examseriesdescription AS examSeriesDescription,

      sc.studentclassid AS studentClassId,
      sc.classschhdid AS classSchedule,
      sc.studentid AS classStudent

    FROM students s
    LEFT JOIN studentexamseries se
      ON s.studentid = se.studentid
    LEFT JOIN examseries es
      ON se.examseriesid = es.examseriesid
    LEFT JOIN studentclass sc
      ON s.studentid = sc.studentid

    WHERE s.studentid IN (?)
    ${orderBy}
  `;

  const [rows] = await pool.query(detailQuery, [ids, ...orderParams]);

  const map = new Map();

  rows.forEach((row) => {
    if (!map.has(row.studentId)) {
      map.set(row.studentId, {
        studentId: row.studentId,
        studentName: row.studentName,
        studentIdNo: row.studentIdNo,
        studentClassId: row.studentClassId,
        examSeries: [],
        studentClass: [],
      });
    }

    if (row.examSeriesId) {
      const student = map.get(row.studentId);

      const isExist = student.examSeries.some(
        (item) => item.examSeriesId === row.examSeriesId,
      );

      if (!isExist) {
        student.examSeries.push({
          examSeriesId: row.examSeriesId,
          examSeriesDescription: row.examSeriesDescription,
        });
      }
    }
    if (row.studentClassId) {
      const student = map.get(row.studentId);

      const isExist = student.studentClass.some(
        (item) => item.classSchedule === row.classSchedule,
      );

      if (!isExist) {
        student.studentClass.push({
          classSchedule: row.classSchedule,
          classStudent: row.classStudent,
        });
      }
    }
  });

  const formattedRows = Array.from(map.values());

  const countQuery = `
    SELECT COUNT(DISTINCT s.studentid) AS total
    FROM students s
    LEFT JOIN studentclass sc
      ON s.studentid = sc.studentid
   
    ${whereClause}
  `;

  const [countResult] = await pool.query(countQuery, [...params]);

  return {
    data: formattedRows,
    total: countResult[0].total,
  };
};

const getStudentById = async (studentId) => {
  const query = `
    SELECT 
    s.studentid as studentId,
    s.studentname as studentName,
    s.studentidno as studentIdNo,
    s.examseriesid as examSeriesId
 
    FROM students s 
    WHERE s.studentid = ?`;
  const [rows] = await pool.query(query, [studentId]);

  return rows[0];
};

const postStudent = async (conn, data, userId) => {
  const { studentName, studentIdNo } = data;

  const sql =
    "INSERT INTO students (studentname, studentidno, createddate, createdby) VALUES (?, ?, NOW(), ?)";
  const [result] = await conn.execute(sql, [studentName, studentIdNo, userId]);
  return result.insertId;
};

const putStudent = async (conn, id, data, userId) => {
  const { studentName, studentIdNo, editedBy } = data;
  const fields = [];
  const params = [];

  if (studentName) {
    fields.push("studentname = ?");
    params.push(studentName);
  }

  if (studentIdNo) {
    fields.push("studentidno = ?");
    params.push(studentIdNo);
  }

  fields.push("editedby = ?");
  params.push(editedBy || userId);

  fields.push("editeddate = NOW()");

  const sql = `
      UPDATE students
      SET ${fields.join(", ")}
      WHERE studentid = ?
    `;

  params.push(id);

  const [result] = await conn.execute(sql, params);
  return result;
};

const deleteStudent = async (conn, id) => {
  try {
    const sql = `DELETE FROM students WHERE studentid = ?;`;
    const [result] = await conn.query(sql, [id]);
    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getStudent,
  postStudent,
  putStudent,
  deleteStudent,
  getStudentById,
};
