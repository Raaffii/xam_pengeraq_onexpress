const pool = require("../config/db");

const getExamResult = async (
  page,
  limit,
  search = "",
  studentId,
  byExamSeriesId
) => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const offset = (page - 1) * limit;

  const conditions = [];
  const params = [];

  if (search) {
    conditions.push("(es.subjcode LIKE ? OR es.subjdesc LIKE ? )");
    const searchValue = `%${search}%`;
    params.push(searchValue, searchValue);
  }

  if (byExamSeriesId) {
    conditions.push("er.examseriesid=?");
    params.push(byExamSeriesId);
  }

  if (studentId) {
    conditions.push("er.studentid=?");
    params.push(studentId);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const query = `
    SELECT 
    er.examresultsid as examResultsId,
    er.marks as marks,
    er.subjgpa as subjGpa,
    er.subjgrade as subjGrade,
    er.subjresults as subjResults,
    er.retake as retake,
    es.subjcode as subjCode,
    es.subjdesc as subjDesc,
    es.examsubjid as examSubjId,
    esr.examseriesdescription as examSeriesDescription
    FROM examresults er 
    LEFT JOIN examsubj es ON er.examsubjid = es.examsubjid
    LEFT JOIN examseries esr ON er.examseriesid=esr.examseriesid
    ${whereClause}
    ORDER BY er.createddate DESC
    LIMIT ? OFFSET ?`;

  const [rows] = await pool.query(query, [...params, limit, offset]);

  const countQuery = `SELECT COUNT(*) AS total FROM examresults er LEFT JOIN examsubj es ON er.examsubjid = es.examsubjid ${whereClause} ORDER BY er.createddate DESC`;
  const [countResult] = await pool.query(countQuery, [...params]);
  const total = countResult[0].total;

  return { data: rows, total };
};

const postExamResult = async (data) => {
  const {
    examSeriesId,
    examSubjId,
    studentId,
    marks,
    subjGpa,
    subjGrade,
    subjResults,
    retake,
  } = data;

  try {
    const sql =
      "INSERT INTO examresults (examseriesid, examsubjid, studentid, marks,retake, subjgpa, subjgrade, subjresults ) VALUES (?,?,?,?,?,?,?,?)";
    const [result] = await pool.query(sql, [
      examSeriesId,
      examSubjId,
      studentId,
      marks,
      retake,
      subjGpa,
      subjGrade,
      subjResults,
    ]);
    return result;
  } catch (err) {
    throw err;
  }
};

const checkExamResult = async (data) => {
  const { examSeriesId, examSubjId, studentId } = data;

  try {
    const sql =
      "SELECT * FROM examresults er WHERE er.examseriesid = ? AND er.examsubjid = ? AND studentid=?";
    const [result] = await pool.query(sql, [
      examSeriesId,
      examSubjId,
      studentId,
    ]);
    return result;
  } catch (err) {
    throw err;
  }
};

const putExamResult = async (id, data) => {
  const { marks, subjGpa, subjGrade, subjResults, retake } = data;

  try {
    const sql = ` UPDATE examresults SET marks = ?, subjgpa = ?, subjgrade = ?, subjresults=?, retake=? WHERE examresultsid = ? ;`;
    const [result] = await pool.query(sql, [
      marks,
      subjGpa,
      subjGrade,
      subjResults,
      retake,
      id,
    ]);
    return result;
  } catch (err) {
    throw err;
  }
};

const deleteExamResult = async (id) => {
  try {
    const sql = `DELETE FROM examresults WHERE examresultsid = ?;`;
    const [result] = await pool.query(sql, [id]);
    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getExamResult,
  postExamResult,
  checkExamResult,
  putExamResult,
  deleteExamResult,
};
