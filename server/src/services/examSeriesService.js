const pool = require("../config/db");
const ExamFinalGradeModel = require("../models/examFinalGradeModel");
const ExamSeries = require("../models/examSeriesModel");
const SubjGradeModel = require("../models/subjGradeModel");
const SubjModel = require("../models/subjModel");
const { defaultExamFinalGrades } = require("../utils/data");

const ExamSeriesService = {
  async getExamSeries(page, pageSize, searchTerm, byExam, examId) {
    return await ExamSeries.getSeries(
      page,
      pageSize,
      searchTerm,
      byExam,
      examId,
    );
  },

  async getExamSeriesById(examSeriesById) {
    const result = await ExamSeries.getSeriesById(examSeriesById);

    if (!result) {
      throw new Error("Exam Series not found");
    }

    return result;
  },

  async postExamSeries(data) {
    const conn = await pool.getConnection();
    let newSeriesId;

    try {
      await conn.beginTransaction();

      // Create series first (core operation)
      newSeriesId = await ExamSeries.postSeries(conn, data);

      if (!newSeriesId) {
        await conn.rollback();
        throw new Error("Failed to create series");
      }

      // PHASE 1: Try import if specified
      let finalGradesInserted = false;
      if (data.importSeriesId) {
        try {
          await this.importSeriesData(conn, {
            newSeriesId,
            sourceSeriesId: data.importSeriesId,
            userId: data.enteredBy,
          });
          finalGradesInserted = true;
          // console.log(
          //   `Successfully imported series ${data.importSeriesId} -> ${newSeriesId}`,
          // );
        } catch (importError) {
          console.warn(
            `Import failed for series ${data.importSeriesId}:`,
            importError.message,
          );
        }
      }

      // PHASE 2: FALLBACK - Insert defaults if no import OR import failed
      if (!finalGradesInserted) {
        await ExamFinalGradeModel.bulkInsert(conn, {
          seriesId: newSeriesId,
          grades: defaultExamFinalGrades,
        });
        // console.log(`Applied default final grades to series ${newSeriesId}`);
      }

      await conn.commit();
      return await this.getExamSeriesById(newSeriesId);
    } catch (error) {
      await conn.rollback();
      console.error("Service error:", error);
      throw error;
    } finally {
      conn.release();
    }
  },

  async putExamSeries(id, data) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      if (data.examId) {
        const examQuery = `
          SELECT examid 
          FROM exam
          WHERE examid = ? AND active = 1
        `;
        const [examResult] = await conn.execute(examQuery, [data.examId]);

        if (examResult.length === 0) {
          await conn.rollback();
          throw new Error("Exam not found or inactive");
        }
      }

      const result = await ExamSeries.putSeries(conn, id, data);

      if (!result) {
        throw new Error("Exam Series not found or update failed");
      }
      await conn.commit();

      return await this.getExamSeriesById(id);
    } catch (error) {
      await conn.rollback();
      console.error("Service error:", error);
      throw error;
    } finally {
      conn.release();
    }
  },

  async deleteExamSeries(data) {
    try {
      const result = await ExamSeries.deleteSeries(data);

      if (result.affectedRows === 0) {
        throw new Error("Exam Series not found");
      }

      return result;
    } catch (error) {
      console.error("Service error:", error);
      throw error;
    }
  },

  async importSeriesData(conn, data) {
    const { newSeriesId, sourceSeriesId, userId } = data;
    try {
      const [finalGrades] = await conn.execute(
        `SELECT examfinalgradeseq, finalpercent, overallgrade, 
              overallgradepoint, overallrank 
       FROM examfinalgrade 
       WHERE examseriesid = ? AND active = 1
       ORDER BY examfinalgradeseq ASC`,
        [sourceSeriesId],
      );

      if (finalGrades.length > 0) {
        await ExamFinalGradeModel.bulkInsert(conn, {
          seriesId: newSeriesId,
          grades: finalGrades.map((g) => ({
            gradeSeq: g.examfinalgradeseq,
            finalPercent: g.finalpercent,
            grade: g.overallgrade,
            gradePoint: g.overallgradepoint,
            gradeResult: g.overallrank,
          })),
        });
      }

      // 2. Copy subjects and get mapping
      const [subjects] = await conn.execute(
        `SELECT examsubjid, subjcode, subjdesc, subjearncredit 
       FROM examsubj 
       WHERE examseriesid = ? AND active = 1
       ORDER BY examsubjid ASC`,
        [sourceSeriesId],
      );

      if (subjects.length === 0) return;

      // Insert and capture the new IDs
      const insertedSubjIds = await SubjModel.bulkCreateWithIds(conn, {
        examSeriesId: newSeriesId,
        subjects: subjects.map((s) => ({
          subjCode: s.subjcode,
          subjDesc: s.subjdesc,
          subjCredit: s.subjearncredit,
        })),
        enteredBy: userId,
      });

      // Build mapping
      const subjIdMap = {};
      subjects.forEach((subj, index) => {
        subjIdMap[subj.examsubjid] = insertedSubjIds[index];
      });

      // 3. Copy subject grades using parameterized query
      await SubjGradeModel.bulkCopySubjGrades(
        conn,
        newSeriesId,
        sourceSeriesId,
        subjIdMap,
      );
    } catch (error) {
      console.error("Import failed:", error);
      throw error;
    }
  },
};

module.exports = ExamSeriesService;
