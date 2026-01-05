const pool = require("../config/db");

const ExamFinalGradeModel = {
  async examGradeByExamSeriesId(examSeriesId) {
    const query = `
      SELECT 
        efg.examfinalgradeseq AS examFinalGradeSeq,
        efg.finalpercent AS finalPercent,
        efg.overallGrade AS overallGrade,
        efg.overallgradepoint AS overallGradePoint,
        efg.overallrank AS overallRank,
        efg.active
      FROM examfinalgrade efg
      WHERE efg.examseriesid = ?
        AND efg.active = 1
      ORDER BY efg.examfinalgradeid ASC
    `;

    const [rows] = await pool.execute(query, [examSeriesId]);
    return rows;
  },

  async bulkInsert(examSeriesId, data) {
    const values = data.map((item) => [
      examSeriesId || null,
      item.examFinalGradeSeq,
      item.finalPercent,
      item.overallGrade,
      item.overallGradePoint,
      item.overallRank,
      item.active ? 1 : 0,
    ]);
    const flatValues = values.flat();

    const placeholders = data.map(() => "(?, ?, ?, ?, ?, ?, ? )").join(", ");

    const query = `
      INSERT INTO examfinalgrade
      (examseriesid, examfinalgradeseq, finalPercent, overallGrade, overallgradepoint, overallrank, active)
      VALUES ${placeholders}
    `;

    const [result] = await pool.execute(query, flatValues);

    return result.affectedRows;
  },
};

module.exports = ExamFinalGradeModel;
