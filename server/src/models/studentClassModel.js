const pool = require("../config/db");

const getStudentClass = async (options = {}) => {
  const { page, limit, searchTerm, schedule } = options;
  const offset = (page - 1) * limit;

  // const searchValue = `%${searchTerm}%`;

  const conditions = [];
  const params = [];

  if (searchTerm) {
    const searchValue = searchTerm ? `%${searchTerm}%` : "%";
    conditions.push("s.studentname LIKE ?");
    params.push(searchValue);
  }

  if (schedule) {
    conditions.push("sc.classschhdid = ?");
    params.push(schedule);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const finishClassQuery = `
  SELECT COUNT(*) AS totalFinishClass 
  FROM classschdetails cd 
  WHERE cd.classschhdid = ? 
  AND cd.classtoken IS NOT NULL
`;

  const [finishClassResult] = await pool.query(finishClassQuery, [schedule]);
  const totalMeeting = finishClassResult[0].totalFinishClass;

  const query = `
 SELECT 
  s.studentname AS studentName,
  sc.studentclassid AS studentClassId,
  s.studentidno AS studentIdNo,
  sc.createddate as enteredDate,
  s.studentid as studentId,

  COUNT(sat.checkindatetime) AS totalAttend,

  CASE 
    WHEN ? > 0 
    THEN ROUND((COUNT(sat.checkindatetime) / ?) * 100, 0)
    ELSE 0
  END AS attendancePercentage

FROM studentclass sc 
LEFT JOIN students s 
  ON sc.studentid = s.studentid

LEFT JOIN classschdetails cd 
  ON sc.classschhdid = cd.classschhdid
  AND cd.classtoken IS NOT NULL

LEFT JOIN studattendstat sat 
  ON s.studentid = sat.studentid 
  AND cd.classschdetailsid = sat.classschdetailsid

${whereClause}

GROUP BY s.studentid

LIMIT ? OFFSET ?
`;
  const [rows] = await pool.execute(query, [
    totalMeeting,
    totalMeeting,
    ...params,
    limit,
    offset,
  ]);

  const countQuery = `SELECT COUNT(*) AS total FROM studentclass s WHERE s.classschhdid=?`;
  const [countResult] = await pool.query(countQuery, [schedule]);
  const total = countResult[0].total;

  return { data: rows, total };
};

const postStudentClass = async (scheduleId, data) => {
  try {
    const values = data.map((item) => [item, scheduleId]);

    const placeholders = data.map(() => "(?, ?)").join(", ");

    const sql = `INSERT INTO studentclass (studentid, classschhdid) VALUES ${placeholders}`;

    const flatValues = values.flat();
    const [result] = await pool.query(sql, flatValues);

    return result.insertId;
  } catch (err) {
    throw err;
  }
};

const removeStudentFromClass = async (scheduleId, studentIds) => {
  try {
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return { affectedRows: 0 };
    }

    const placeholders = studentIds.map(() => "?").join(", ");

    const sql = `
      DELETE FROM studentclass
      WHERE classschhdid = ?
      AND studentid IN (${placeholders})
    `;

    const values = [scheduleId, ...studentIds];

    const [result] = await pool.query(sql, values);
    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getStudentClass,
  postStudentClass,
  removeStudentFromClass,
};
