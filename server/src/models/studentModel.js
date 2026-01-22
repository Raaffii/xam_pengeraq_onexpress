const pool = require("../config/db");

const getStudent = async (page, limit, searchTerm = "", filter = {}) => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const offset = (page - 1) * limit;

  const { enrolledClass, enrolledSelected } = filter;

  const conditions = [];
  const params = [];

  if (enrolledSelected === "SELECTED") {
    conditions.push("sc.classschhdid = ? ");
    params.push(enrolledClass);
  } else if (enrolledSelected === "NOT_SELECTED") {
    // conditions.push("sc.classschhdid <> ? ");
    // params.push(enrolledClass);
  }

  if (searchTerm) {
    const searchValue = searchTerm ? `%${searchTerm}%` : "%";
    conditions.push("studentname LIKE ?");
    params.push(searchValue);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const studentIdQuery = `
  SELECT DISTINCT s.studentid
  FROM students s
  LEFT JOIN studentclass sc
  ON s.studentid = sc.studentid
  ${whereClause}
  LIMIT ? OFFSET ?
  `;

  const [studentIds] = await pool.query(studentIdQuery, [
    ...params,
    limit,
    offset,
  ]);

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
    SELECT COUNT(*) AS total
    FROM students s
    LEFT JOIN studentexamseries se
      ON s.studentid = se.studentid
    LEFT JOIN examseries es
      ON se.examseriesid = es.examseriesid
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
  const { studentName, studentIdNo, examSeriesId } = data;

  try {
    const sql =
      "INSERT INTO students (studentname, studentidno, examseriesid, createdby) VALUES (?, ?,?,?)";
    const [result] = await conn.query(sql, [
      studentName,
      studentIdNo,
      null,
      userId,
    ]);
    return result.insertId;
  } catch (err) {
    throw err;
  }
};

const putStudent = async (conn, id, data, userId) => {
  const { studentName, studentIdNo } = data;
  try {
    const sql = ` UPDATE students SET studentname = ?, studentidno = ?, examseriesid = ?, editedby=?, editeddate=? WHERE studentid = ? ;`;
    const [result] = await conn.query(sql, [
      studentName,
      studentIdNo,
      null,
      userId,
      new Date(),
      id,
    ]);
    return result;
  } catch (err) {
    throw err;
  }
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
