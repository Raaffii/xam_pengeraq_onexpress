const pool = require("../config/db");

const getExamSeries = async (page, limit, searchTerm = "", byExam, examId) => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;

  const conditions = [];
  const params = [];

  //where
  if (searchTerm) {
    conditions.push(
      "(LOWER(es.examseriesdescription) LIKE ? OR LOWER(e.examname) LIKE ? )"
    );
    const searchValue = `%${searchTerm}%`;
    params.push(searchValue, searchValue);
  }

  if (byExam) {
    conditions.push("LOWER(es.examid)=?");
    params.push(byExam);
  }

  if (examId) {
    conditions.push("es.examseriesid=?");
    params.push(examId);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // base query
  let query = `
    SELECT 
    es.examseriesid as examSeriesId,
    es.examseriesdescription as examSeriesDescription,
    es.examseriesenddate as examSeriesEndDate,
    es.examseriesstartdate as examSeriesStartDate,
    es.credits as credits,
    es.examid as examId,
    e.examname as examName 
    FROM examseries es
    LEFT JOIN exam e ON es.examid = e.examid   
   ${whereClause}
    ORDER BY es.createddate DESC
    `;

  const queryParams = [...params];

  if (page && limit) {
    const offset = (page - 1) * limit;
    query += `LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);
  }

  const [rows] = await pool.query(query, queryParams);

  const countQuery = `SELECT COUNT(*) AS total FROM examseries es ${whereClause}`;
  const [countResult] = await pool.query(countQuery, params);

  const total = countResult[0].total;

  return { data: rows, total };
};

const getExamSeriesById = async (examSeriesId) => {
  const sql = `SELECT * FROM examseries WHERE examseriesid=?`;
  const [result] = await pool.query(sql, [examSeriesId]);

  return { data: result };
};

const postExamSeries = async (data) => {
  const {
    examId,
    examSeriesDescription,
    examSeriesStartDate,
    examSeriesEndDate,
    credits,
  } = data;

  try {
    const sql =
      "INSERT INTO examseries (examid,  examseriesdescription,examseriesstartdate,examseriesenddate,credits) VALUES (?, ?,?,?,?)";
    const [result] = await pool.query(sql, [
      examId,
      examSeriesDescription,
      examSeriesStartDate,
      examSeriesEndDate,
      credits,
    ]);
    return result.insertId;
  } catch (err) {
    throw err;
  }
};

const putExamSeries = async (id, data) => {
  const {
    examId,
    examSeriesDescription,
    examSeriesStartDate,
    examSeriesEndDate,
    credits,
  } = data;

  try {
    const sql = `UPDATE examseries SET  examid = ?,
    examseriesdescription = ?,
    examseriesstartdate =? ,
    examseriesenddate =? ,
    credits=? WHERE examseriesid = ? ;`;
    const [result] = await pool.query(sql, [
      examId,
      examSeriesDescription,
      examSeriesStartDate,
      examSeriesEndDate,
      credits,
      id,
    ]);
    return result;
  } catch (err) {
    throw err;
  }
};

const deleteExamSeries = async (data) => {
  const { examSeriesToDelete, editedBy } = data;

  try {
    const sql = `DELETE FROM examseries WHERE examseriesid = ?;`;
    const [result] = await pool.query(sql, [examSeriesToDelete]);
    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getExamSeries,
  postExamSeries,
  putExamSeries,
  deleteExamSeries,
  getExamSeriesById,
};
