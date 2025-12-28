const pool = require("../config/db");

const getExamResult = async (page, limit, search = "", studentId) => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const offset = (page - 1) * limit;

  const searchValue = `%${search}%`;
  console.log("sutdent", studentId);
  const query = `
    SELECT 
    er.marks as marks,
    er.subjgpa as subjGpa,
    er.subjgrade as subjGrade,
    er.subjresults as subjResults,
    er.retake as retake,
    es.subjcode as subjCode,
    es.subjdesc as subjDesc
    FROM examresults er 
    LEFT JOIN examsubj es ON er.examsubjid = es.examsubjid
    WHERE er.studentid= ?
    ORDER BY er.createddate DESC
    LIMIT ? OFFSET ?`;
  const [rows] = await pool.query(query, [studentId, limit, offset]);

  const countQuery = `SELECT COUNT(*) AS total FROM examresults er WHERE er.studentid = ? ORDER BY er.createddate DESC`;
  const [countResult] = await pool.query(countQuery, [studentId]);
  const total = countResult[0].total;
  console.log("ro", rows);
  return { data: rows, total };
};

module.exports = { getExamResult };
