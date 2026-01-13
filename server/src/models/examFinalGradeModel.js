const pool = require("../config/db");

const ExamFinalGradeModel = {
  async fetch(options = {}) {
    const { page, pageSize, byId, bySeries, searchTerm, isActive } = options;

    const conditions = [];
    const params = [];

    if (isActive === true) {
      conditions.push("fg.active = ?");
      params.push(1);
    } else if (isActive === false) {
      conditions.push("fg.active = ?");
      params.push(0);
    }

    if (bySeries) {
      conditions.push("fg.examseriesid = ?");
      params.push(bySeries);
    }

    if (byId) {
      conditions.push("fg.examfinalgradeid = ?");
      params.push(byId);
    }

    if (searchTerm) {
      conditions.push("(LOWER(e.examseriesdescription) LIKE ?)");
      const searchPattern = `%${searchTerm.toLowerCase()}%`;
      params.push(searchPattern);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countQuery = `
      SELECT COUNT(*) as total 
      FROM examfinalgrade fg
      LEFT JOIN examseries e ON e.examseriesid = fg.examseriesid
      ${whereClause}
    `;
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    // Build base query
    let query = `
      SELECT 
        fg.examfinalgradeid AS gradeId,
        fg.examseriesid AS seriesId,
        e.examseriesdescription AS seriesDesc,
        fg.examfinalgradeseq AS gradeSeq,
        fg.finalpercent AS finalPercent,
        fg.overallgrade AS grade,
        fg.overallgradepoint AS gradePoint,
        fg.overallrank AS gradeResult,
        fg.createddate AS enteredDate,
        fg.editeddate AS editedDate
      FROM examfinalgrade fg
      LEFT JOIN examseries e ON e.examseriesid = fg.examseriesid
      ${whereClause}
      ORDER BY fg.examseriesid ASC, fg.examfinalgradeseq ASC
    `;

    const queryParams = [...params];

    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      query += ` LIMIT ? OFFSET ?`;
      queryParams.push(String(pageSize), String(offset));
    }

    const [rows] = await pool.execute(query, queryParams);

    return {
      users: rows,
      total,
      page: page || null,
      pageSize: pageSize || null,
    };
  },

  async findById(gradeId) {
    const query = `
      SELECT 
        fg.examfinalgradeid AS gradeId,
        fg.examseriesid AS seriesId,
        eg.examseriesdescription AS seriesDesc,
        fg.examfinalgradeseq AS gradeSeq,
        fg.finalpercent AS finalPercent,
        fg.overallgradepoint AS gradePoint,
        fg.overallrank AS gradeRank,
        fg.active
      FROM examfinalgrade fg 
      LEFT JOIN examseries eg ON eg.examseriesid = fg.examseriesid
      WHERE fg.examfinalgradeid = ? AND fg.active = 1 AND eg.active = 1
    `;

    const [rows] = await pool.execute(query, [gradeId]);
    return rows.length > 0 ? rows[0] : null;
  },

  async insert(conn, data) {
    const query = `
      INSERT INTO examfinalgrade 
      (examseriesid, examfinalgradeseq, finalpercent, overallgrade, overallgradepoint, overallrank, createdby, createddate, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), 1)
    `;

    const [result] = await conn.execute(query, [
      data.seriesId,
      data.gradeSeq,
      data.finalPercent,
      data.grade,
      data.gradePoint,
      data.gradeResult,
      data.enteredBy,
    ]);

    return result.insertId;
  },

  async bulkInsert(conn, data) {
    const { seriesId, grades } = data;

    const values = grades.map((grade) => [
      seriesId,
      grade.gradeSeq,
      grade.finalPercent,
      grade.grade,
      grade.gradePoint,
      grade.gradeResult,
      1,
    ]);

    const placeholders = grades.map(() => "(?, ?, ?, ?, ?, ?, ?)").join(", ");

    const query = `
      INSERT INTO examfinalgrade 
      (examseriesid, examfinalgradeseq, finalpercent, overallgrade, overallgradepoint, overallrank, active)
      VALUES ${placeholders}
    `;

    const flatValues = values.flat();

    const [result] = await conn.execute(query, flatValues);
    return result.affectedRows;
  },

  async updateGrade(conn, data) {
    const {
      gradeId,
      gradeSeq,
      finalPercent,
      grade,
      gradePoint,
      gradeResult,
      active,
    } = data;

    const fields = [];
    const params = [];

    if (gradeSeq) {
      fields.push("examfinalgradeseq = ?");
      params.push(gradeSeq);
    }

    if (finalPercent) {
      fields.push("finalpercent = ?");
      params.push(finalPercent);
    }

    if (grade) {
      fields.push("overallgrade = ?");
      params.push(grade);
    }

    if (gradePoint) {
      fields.push("overallgradepoint = ?");
      params.push(gradePoint);
    }

    if (gradeResult) {
      fields.push("overallrank = ?");
      params.push(gradeResult);
    }

    if (active !== undefined) {
      fields.push("active = ?");
      params.push(active);
    }

    if (fields.length === 0) {
      return false;
    }

    const query = `
      UPDATE examfinalgrade
      SET ${fields.join(", ")}
      WHERE examfinalgradeid = ?
    `;

    params.push(gradeId);

    const [result] = await conn.execute(query, params);
    return result.affectedRows > 0;
  },

  async deleteById(conn, gradeId) {
    const query = `
      DELETE FROM examfinalgrade
      WHERE examfinalgradeid = ?
    `;

    const [result] = await conn.execute(query, [gradeId]);
    return result.affectedRows;
  },

  async deleteBySeriesId(conn, seriesId) {
    const query = `
      DELETE FROM examfinalgrade
      WHERE examseriesid = ?
    `;

    const [result] = await conn.execute(query, [seriesId]);
    return result.affectedRows;
  },

  async examGradeByExamSeriesId(examSeriesId) {
    const query = `
      SELECT 
        efg.examfinalgradeseq AS gradeSeq,
        efg.finalpercent AS finalPercent,
        efg.overallGrade AS grade,
        efg.overallgradepoint AS gradePoint,
        efg.overallrank AS gradeResult,
        efg.active
      FROM examfinalgrade efg
      WHERE efg.examseriesid = ?
        AND efg.active = 1
      ORDER BY efg.examfinalgradeid ASC
    `;

    const [rows] = await pool.execute(query, [examSeriesId]);
    return rows;
  },
};

module.exports = ExamFinalGradeModel;
