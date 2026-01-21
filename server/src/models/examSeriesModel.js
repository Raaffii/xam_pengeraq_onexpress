const pool = require("../config/db");

const SeriesModel = {
  async getSeries(page, pageSize, searchTerm = "", byExam, examId) {
    const conditions = [];
    const params = [];

    if (searchTerm) {
      conditions.push(
        "(LOWER(es.examseriesdescription) LIKE ? OR LOWER(e.examname) LIKE ?)",
      );
      const searchValue = `%${searchTerm}%`;
      params.push(searchValue, searchValue);
    }

    if (byExam) {
      conditions.push("es.examid=?");
      params.push(byExam);
    }

    if (examId) {
      conditions.push("es.examseriesid=?");
      params.push(examId);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    let query = `
      SELECT 
        es.examseriesid as seriesId,
        es.examseriesdescription as seriesDesc,
        es.examseriesenddate as seriesEndDate,
        es.examseriesstartdate as seriesStartDate,
        es.credits as seriesCredit,
        es.examid as examId,
        e.examname as examName 
      FROM examseries es
      LEFT JOIN exam e ON es.examid = e.examid   
      ${whereClause}
      ORDER BY es.createddate DESC
<<<<<<< HEAD

=======
>>>>>>> origin/second
    `;

    const queryParams = [...params];

    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      query += ` LIMIT ? OFFSET ?`;
      queryParams.push(String(pageSize), String(offset));
    }

    const [rows] = await pool.execute(query, queryParams);

    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM examseries es
      LEFT JOIN exam e ON es.examid = e.examid
      ${whereClause}
    `;

    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    return { data: rows, total };
  },

  async getSeriesById(examSeriesId) {
    const query = `
      SELECT 
        es.examseriesid as seriesId,
        es.examseriesdescription as seriesDesc,
        es.examseriesenddate as seriesEndDate,
        es.examseriesstartdate as seriesStartDate,
        es.credits as seriesCredit,
        es.examid as examId,
        e.examname as examName 
      FROM examseries es
      LEFT JOIN exam e ON es.examid = e.examid
      WHERE es.examseriesid = ?
    `;

    const [rows] = await pool.execute(query, [examSeriesId]);

    return rows.length > 0 ? rows[0] : null;
  },

  async postSeries(conn, data) {
    const { examId, seriesDesc, seriesStartDate, seriesEndDate, seriesCredit } =
      data;

    const sql =
      "INSERT INTO examseries (examid, examseriesdescription, examseriesstartdate, examseriesenddate, credits) VALUES (?, ?, ?, ?, ?)";
    const [result] = await conn.query(sql, [
      examId,
      seriesDesc,
      seriesStartDate,
      seriesEndDate,
      seriesCredit,
    ]);
    return result.insertId;
  },

  async putSeries(conn, seriesId, data) {
    const {
      examId,
      seriesDesc,
      seriesStartDate,
      seriesEndDate,
      seriesCredit,
      active,
      editedBy,
    } = data;

    const fields = [];
    const params = [];

    if (seriesDesc !== undefined) {
      fields.push("examseriesdescription = ?");
      params.push(seriesDesc);
    }

    if (seriesStartDate !== undefined) {
      fields.push("examseriesstartdate = ?");
      params.push(seriesStartDate);
    }

    if (seriesEndDate !== undefined) {
      fields.push("examseriesenddate = ?");
      params.push(seriesEndDate);
    }

    if (seriesCredit !== undefined) {
      fields.push("credits = ?");
      params.push(seriesCredit);
    }

    if (examId !== undefined) {
      fields.push("examid = ?");
      params.push(examId);
    }

    if (active !== undefined) {
      fields.push("active = ?");
      params.push(active);
    }

    fields.push("editedby = ?");
    params.push(editedBy);

    fields.push("editeddate = NOW()");

    const sql = `
      UPDATE examseries
      SET ${fields.join(", ")}
      WHERE examseriesid = ?
    `;

    params.push(seriesId);

    const [result] = await conn.execute(sql, params);
    return result.affectedRows > 0;
  },

  async deleteSeries(data) {
    const { examSeriesToDelete } = data;

    try {
      const sql = `DELETE FROM examseries WHERE examseriesid = ?`;
      const [result] = await pool.query(sql, [examSeriesToDelete]);
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = SeriesModel;
