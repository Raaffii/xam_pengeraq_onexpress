const pool = require("../config/db");

const SubjModel = {
  async findAll(options = {}) {
    const { page, pageSize, series, searchTerm } = options;

    const conditions = [];
    const params = [];

    if (series) {
      conditions.push("e.examseriesid = ?");
      params.push(series.toLowerCase());
    }

    conditions.push("s.active = ? AND e.active = ?");
    params.push(1, 1);

    if (searchTerm) {
      conditions.push("(LOWER(s.subjdesc) LIKE ? OR LOWER(s.subjcode) LIKE ?)");
      const searchPattern = `%${searchTerm.toLowerCase()}%`;
      params.push(searchPattern, searchPattern);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countQuery = `
      SELECT COUNT(*) as total 
      FROM examsubj s
      LEFT JOIN examseries e ON e.examseriesid = s.examseriesid
      ${whereClause}
    `;
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    // Build base query
    let query = `
      SELECT 
        s.examsubjid AS subjId,
        s.subjcode AS subjCode,
        s.subjdesc AS subjDesc,
        s.subjearncredit AS subjCredit,
        e.examseriesid AS seriesId,
        e.examseriesdescription AS seriesDesc,
        e.credits AS seriesCredits,
        s.createddate AS enteredDate,
        s.editeddate AS editedDate
      FROM examsubj s
      LEFT JOIN examseries e ON e.examseriesid = s.examseriesid
      ${whereClause}
    `;

    const queryParams = [...params];

    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      query += ` LIMIT ? OFFSET ?`;
      queryParams.push(String(pageSize), String(offset));
    }

    const [rows] = await pool.execute(query, queryParams);

    return {
      examSubj: rows,
      total,
      page: page || null,
      pageSize: pageSize || null,
    };
  },

  async findByExamSeriesId(examSeriesId) {
    const query = `
      SELECT 
        s.examsubjid AS subjId,
        s.subjcode AS subjCode,
        s.subjdesc AS subjDesc,
        s.subjearncredit AS subjCredit,
        e.examseriesid AS seriesId,
        e.examseriesdescription AS seriesDesc,
        e.credits AS seriesCredits,
        s.createddate AS enteredDate,
        s.editeddate AS editedDate
      FROM examsubj s
      LEFT JOIN examseries e ON e.examseriesid = s.examseriesid
      WHERE s.examseriesid = ?
        AND s.active = 1
    `;

    const [rows] = await pool.execute(query, [examSeriesId]);

    return { examSubj: rows };
  },

  async createSubject(conn, data) {
    const { subjCode, subjDesc, subjCredit, enteredBy, examseriesId } = data;

    const query = `
      INSERT INTO examsubj (subjcode, subjdesc, subjearncredit, examseriesid, createdby, createddate, active)
      VALUES (?, ?, ?, ?, ?, utc_timestamp(), 1)
    `;

    const [result] = await conn.execute(query, [
      subjCode,
      subjDesc,
      subjCredit,
      examseriesId || null,
      enteredBy || null,
    ]);

    return result.insertId;
  },

  async putSubj(conn, updateData) {
    const {
      subjId,
      editedBy,
      subjDesc,
      subjCode,
      subjCredit,
      active,
      seriesId,
    } = updateData;

    const fields = [];
    const params = [];

    if (subjDesc !== undefined) {
      fields.push("subjdesc = ?");
      params.push(subjDesc);
    }

    if (subjCode !== undefined) {
      fields.push("subjcode = ?");
      params.push(subjCode);
    }

    if (subjCredit !== undefined) {
      fields.push("subjearncredit = ?");
      params.push(subjCredit);
    }

    if (active !== undefined) {
      fields.push("active = ?");
      params.push(active);
    }

    if (seriesId !== undefined) {
      fields.push("examseriesid = ?");
      params.push(seriesId);
    }

    fields.push("editedby = ?");
    params.push(editedBy);

    fields.push("editeddate = utc_timestamp()");

    const sql = `
      UPDATE examsubj
      SET ${fields.join(", ")}
      WHERE examsubjid = ?
    `;

    params.push(subjId);

    const [result] = await conn.execute(sql, params);
    return result.affectedRows > 0;
  },

  async softDeleteSubj(conn, data) {
    const { subjToDelete, editedBy } = data;

    const query = `
      UPDATE examsubj
      SET active = 0, editedby = ?, editeddate = utc_timestamp()
      WHERE examsubjid = ?
    `;

    const [result] = await conn.execute(query, [editedBy, subjToDelete]);
    return result.affectedRows > 0;
  },

  async fetchSubjById(subjId) {
    const query = `
      SELECT 
        s.examsubjid AS subjId,
        s.subjcode AS subjCode,
        s.subjdesc AS subjDesc,
        s.subjearncredit AS subjCredit,
        s.examseriesid AS seriesId,
        e.examseriesdescription AS seriesDesc,
        e.credits AS seriesCredits,
        s.createdby AS enteredBy,
        s.createddate AS enteredDate,
        s.editedby AS editedBy,
        s.editeddate AS editedDate,
        s.active
      FROM examsubj s
      LEFT JOIN examseries e ON e.examseriesid = s.examseriesid
      WHERE s.examsubjid = ?
    `;

    const [rows] = await pool.execute(query, [subjId]);
    return rows.length > 0 ? rows[0] : null;
  },

  async bulkCreateWithIds(conn, data) {
    const { examSeriesId, subjects, enteredBy } = data;

    const values = subjects.map((subj) => [
      examSeriesId,
      subj.subjCode,
      subj.subjDesc,
      subj.subjCredit,
      enteredBy || null,
      1,
    ]);

    const placeholders = subjects
      .map(() => "(?, ?, ?, ?, ?, utc_timestamp(), ?)")
      .join(", ");

    const query = `
    INSERT INTO examsubj 
    (examseriesid, subjcode, subjdesc, subjearncredit, createdby, createddate, active)
    VALUES ${placeholders}
  `;

    const [result] = await conn.execute(query, values.flat());

    const firstId = result.insertId;
    return Array.from({ length: subjects.length }, (_, i) => firstId + i);
  },
};

module.exports = SubjModel;
