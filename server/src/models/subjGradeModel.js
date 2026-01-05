const pool = require("../config/db");

const SubjGradeModel = {
  /**
   * Get all grades for a specific subject
   */
  async findBySubjId(subjId) {
    const query = `
      SELECT 
        sg.subjgradeid AS gradeId,
        sg.examseriesid AS seriesId,
        sg.examsubjid AS subjId,
        sg.subjgradeseq AS gradeSeq,
        sg.subjmin AS minScore,
        sg.subjmax AS maxScore,
        sg.subjgrade AS grade,
        sg.subjgpa AS gpa,
        sg.subjresult AS result,
        sg.active
      FROM subjgrade sg
      WHERE sg.examsubjid = ?
      ORDER BY sg.subjgradeseq ASC
    `;

    const [rows] = await pool.execute(query, [subjId]);
    return rows;
  },

  /**
   * Get all grades for a specific subject and series
   */
  async findBySubjAndSeries(subjId, seriesId) {
    const query = `
      SELECT 
        sg.subjgradeid AS gradeId,
        sg.examseriesid AS seriesId,
        sg.examsubjid AS subjId,
        sg.subjgradeseq AS gradeSeq,
        sg.subjmin AS minScore,
        sg.subjmax AS maxScore,
        sg.subjgrade AS grade,
        sg.subjgpa AS gpa,
        sg.subjresult AS result,
        sg.active
      FROM subjgrade sg
      WHERE sg.examsubjid = ? 
        AND (sg.examseriesid = ? OR sg.examseriesid IS NULL)
      ORDER BY sg.subjgradeseq ASC
    `;

    const [rows] = await pool.execute(query, [subjId, seriesId]);
    return rows;
  },

  /**
   * Get a specific grade by ID
   */
  async findById(gradeId) {
    const query = `
      SELECT 
        sg.subjgradeid AS gradeId,
        sg.examseriesid AS seriesId,
        sg.examsubjid AS subjId,
        sg.subjgradeseq AS gradeSeq,
        sg.subjmin AS minScore,
        sg.subjmax AS maxScore,
        sg.subjgrade AS grade,
        sg.subjgpa AS gpa,
        sg.subjresult AS result,
        sg.active
      FROM subjgrade sg
      WHERE sg.subjgradeid = ?
    `;

    const [rows] = await pool.execute(query, [gradeId]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Bulk insert subject grades (used when creating a new subject)
   */
  async bulkInsert(conn, data) {
    const { examsubjid, examseriesid, grades } = data;

    const values = grades.map((grade) => [
      examseriesid || null,
      examsubjid,
      grade.subjgradeseq,
      grade.subjmin,
      grade.subjmax,
      grade.subjgrade,
      grade.subjgpa,
      grade.subjresult,
      grade.active ? 1 : 0,
    ]);

    const placeholders = grades
      .map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .join(", ");

    const query = `
      INSERT INTO subjgrade 
      (examseriesid, examsubjid, subjgradeseq, subjmin, subjmax, subjgrade, subjgpa, subjresult, active)
      VALUES ${placeholders}
    `;

    const flatValues = values.flat();

    const [result] = await conn.execute(query, flatValues);
    return result.affectedRows;
  },

  /**
   * Update a single grade
   */
  async updateGrade(conn, gradeId, data) {
    const {
      gradeSeq,
      subjMin,
      subjMax,
      subjGrade,
      subjGpa,
      subjResult,
      active,
    } = data;

    const fields = [];
    const params = [];

    if (gradeSeq !== undefined) {
      fields.push("subjgradeseq = ?");
      params.push(gradeSeq);
    }

    if (subjMin !== undefined) {
      fields.push("subjmin = ?");
      params.push(subjMin);
    }

    if (subjMax !== undefined) {
      fields.push("subjmax = ?");
      params.push(subjMax);
    }

    if (subjGrade !== undefined) {
      fields.push("subjgrade = ?");
      params.push(subjGrade);
    }

    if (subjGpa !== undefined) {
      fields.push("subjgpa = ?");
      params.push(subjGpa);
    }

    if (subjResult !== undefined) {
      fields.push("subjresult = ?");
      params.push(subjResult);
    }

    if (active !== undefined) {
      fields.push("active = ?");
      params.push(active);
    }

    if (fields.length === 0) {
      return false;
    }

    const query = `
      UPDATE subjgrade
      SET ${fields.join(", ")}
      WHERE subjgradeid = ?
    `;

    params.push(gradeId);

    const [result] = await conn.execute(query, params);
    return result.affectedRows > 0;
  },

  /**
   * Delete a grade by ID
   */
  async deleteById(conn, gradeId) {
    const query = `
      DELETE FROM subjgrade
      WHERE subjgradeid = ?
    `;

    const [result] = await conn.execute(query, [gradeId]);
    return result.affectedRows;
  },

  /**
   * Delete grades by subject ID (used when deleting a subject)
   */
  async deleteBySubjId(conn, subjId) {
    const query = `
      DELETE FROM subjgrade
      WHERE examsubjid = ?
    `;

    const [result] = await conn.execute(query, [subjId]);
    return result.affectedRows;
  },

  /**
   * Get grade for a specific score
   */
  async getGradeForScore(subjId, score) {
    const query = `
      SELECT 
        sg.subjgradeid AS gradeId,
        sg.subjgrade AS grade,
        sg.subjgpa AS gpa,
        sg.subjresult AS result,
        sg.subjmin AS minScore,
        sg.subjmax AS maxScore
      FROM subjgrade sg
      WHERE sg.examsubjid = ?
        AND sg.active = 1
        AND ? BETWEEN sg.subjmin AND sg.subjmax
      LIMIT 1
    `;

    const [rows] = await pool.execute(query, [subjId, score]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Check if grade range overlaps with existing grades
   */
  async checkOverlap(subjId, minScore, maxScore, excludeGradeId = null) {
    let query = `
      SELECT subjgradeid
      FROM subjgrade
      WHERE examsubjid = ?
        AND active = 1
        AND (
          (subjmin <= ? AND subjmax >= ?)
          OR (subjmin <= ? AND subjmax >= ?)
          OR (subjmin >= ? AND subjmax <= ?)
        )
    `;

    const params = [
      subjId,
      minScore,
      minScore,
      maxScore,
      maxScore,
      minScore,
      maxScore,
    ];

    if (excludeGradeId) {
      query += " AND subjgradeid != ?";
      params.push(excludeGradeId);
    }

    const [rows] = await pool.execute(query, params);
    return rows.length > 0;
  },

  async findDuplicateGrades() {
    const query = `
      SELECT 
        sg.examsubjid AS subjId,
        es.subjcode AS subjCode,
        es.subjdesc AS subjDesc,
        sg.subjgradeseq AS gradeSeq,
        COUNT(*) AS duplicateCount,
        GROUP_CONCAT(sg.subjgradeid ORDER BY sg.subjgradeid ASC) AS gradeIds
      FROM subjgrade sg
      INNER JOIN examsubj es ON sg.examsubjid = es.examsubjid
      WHERE sg.active = 1
      GROUP BY sg.examsubjid, sg.subjgradeseq
      HAVING COUNT(*) > 1
      ORDER BY sg.examsubjid, sg.subjgradeseq
    `;

    const [rows] = await pool.execute(query);
    return rows;
  },

  async deleteDuplicateGrades(conn, gradeIds) {
    if (!gradeIds || gradeIds.length === 0) {
      return 0;
    }

    const placeholders = gradeIds.map(() => "?").join(", ");
    const query = `
      DELETE FROM subjgrade
      WHERE subjgradeid IN (${placeholders})
    `;

    const [result] = await conn.execute(query, gradeIds);
    return result.affectedRows;
  },

  async findGradesBySubjAndSeq(subjId, gradeSeq) {
    const query = `
      SELECT 
        sg.subjgradeid AS gradeId,
        sg.examseriesid AS seriesId,
        sg.examsubjid AS subjId,
        sg.subjgradeseq AS gradeSeq,
        sg.subjmin AS minScore,
        sg.subjmax AS maxScore,
        sg.subjgrade AS grade,
        sg.subjgpa AS gpa,
        sg.subjresult AS result,
        sg.active
      FROM subjgrade sg
      WHERE sg.examsubjid = ?
        AND sg.subjgradeseq = ?
        AND sg.active = 1
      ORDER BY sg.subjgradeid ASC
    `;

    const [rows] = await pool.execute(query, [subjId, gradeSeq]);
    return rows;
  },

  async findGradesByExamSeriesId(examSeriesId) {
    const query = `
      SELECT 
        sg.subjgradeid AS gradeId,
        sg.examseriesid AS seriesId,
        sg.examsubjid AS subjId,
        sg.subjgradeseq AS gradeSeq,
        sg.subjmin AS minScore,
        sg.subjmax AS maxScore,
        sg.subjgrade AS grade,
        sg.subjgpa AS gpa,
        sg.subjresult AS result,
        sg.active
      FROM subjgrade sg
      WHERE sg.examseriesid = ?
        AND sg.active = 1
      ORDER BY sg.subjgradeid ASC
    `;

    const [rows] = await pool.execute(query, [examSeriesId]);
    return rows;
  },

  async findSubjectsWithoutGrades() {
    const query = `
      SELECT 
        es.examsubjid AS subjId,
        es.subjcode AS subjCode,
        es.subjdesc AS subjDesc,
        es.examseriesid AS seriesId,
        ser.examseriesdescription AS seriesDesc,
        es.active
      FROM examsubj es
      LEFT JOIN subjgrade sg ON es.examsubjid = sg.examsubjid
      LEFT JOIN examseries ser ON es.examseriesid = ser.examseriesid
      WHERE sg.subjgradeid IS NULL
        AND es.active = 1
      ORDER BY es.examseriesid, es.subjcode
    `;

    const [rows] = await pool.execute(query);
    return rows;
  },

  async countActiveSubjects() {
    const query = `
      SELECT COUNT(*) as total
      FROM examsubj
      WHERE active = 1
    `;

    const [rows] = await pool.execute(query);
    return rows[0]?.total || 0;
  },
};

module.exports = SubjGradeModel;
