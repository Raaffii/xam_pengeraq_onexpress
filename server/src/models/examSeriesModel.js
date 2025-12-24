const pool = require("../config/db");

const getExamSeries = async (page, limit, search = "") => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const offset = (page - 1) * limit;

  const searchValue = `%${search}%`;

  const query = `
    SELECT 
    es.examseriesid as examSeriesId,
    es.examseriesdescription as examSeriesDescription,
    es.examseriesenddate as examSeriesEndDate,
    es.examseriesstartdate as examSeriesStartDate,
    es.credits as credits,
    es.examid as examId,
    e.examname as examName 
    FROM examseries es
    LEFT JOIN exam e ON es.examid =e.examid   
    WHERE es.examseriesdescription LIKE ? 
    ORDER BY es.createddate DESC
    LIMIT ? OFFSET ? `;
  const [rows] = await pool.query(query, [searchValue, limit, offset]);

  const countQuery = `SELECT COUNT(*) AS total FROM examseries es WHERE es.examseriesdescription LIKE ?`;
  const [countResult] = await pool.query(countQuery, [
    searchValue,
    searchValue,
  ]);

  const total = countResult[0].total;

  return { data: rows, total };
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
    return result;
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
};
