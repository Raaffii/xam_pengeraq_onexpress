const SubjGradeModel = require("../models/subjGradeModel");
const SubjModel = require("../models/subjModel");
const pool = require("../config/db");

const subjGradeService = {
  /**
   * Get all grades for a subject
   */
  async getSubjectGrades(subjId, seriesId = null) {
    const subject = await SubjModel.fetchSubjById(subjId);
    if (!subject) {
      throw new Error("Subject not found");
    }

    let grades;
    if (seriesId) {
      grades = await SubjGradeModel.findBySubjAndSeries(subjId, seriesId);
    } else {
      grades = await SubjGradeModel.findBySubjId(subjId);
    }

    return {
      subject,
      grades,
    };
  },

  /**
   * Update a single grade
   */
  async updateGrade(subjId, gradeId, data) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const subject = await SubjModel.fetchSubjById(subjId);
      if (!subject) {
        throw new Error("Subject not found");
      }

      const existingGrade = await SubjGradeModel.findById(gradeId);
      if (!existingGrade) {
        throw new Error("Grade not found");
      }

      if (existingGrade.subjId !== parseInt(subjId)) {
        throw new Error("Subject mismatch");
      }

      if (data.subjMin !== undefined || data.subjMax !== undefined) {
        const minScore =
          data.subjMin !== undefined ? data.subjMin : existingGrade.minScore;
        const maxScore =
          data.subjMax !== undefined ? data.subjMax : existingGrade.maxScore;

        if (parseFloat(minScore) >= parseFloat(maxScore)) {
          throw new Error("Minimum score must be less than maximum score");
        }

        const hasOverlap = await SubjGradeModel.checkOverlap(
          existingGrade.subjId,
          minScore,
          maxScore,
          gradeId,
        );

        if (hasOverlap) {
          throw new Error("Grade range overlaps with existing grades");
        }
      }

      const updated = await SubjGradeModel.updateGrade(conn, gradeId, data);
      if (!updated) {
        throw new Error("Failed to update grade");
      }

      await conn.commit();

      return await SubjGradeModel.findById(gradeId);
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },

  /**
   * Delete a single grade
   */
  async deleteGrade(subjId, gradeId) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const subject = await SubjModel.fetchSubjById(subjId);
      if (!subject) {
        throw new Error("Subject not found");
      }

      const grade = await SubjGradeModel.findById(gradeId);
      if (!grade) {
        throw new Error("Grade not found");
      }

      if (grade.subjId !== parseInt(subjId)) {
        throw new Error("Subject mismatch");
      }

      await SubjGradeModel.deleteById(conn, gradeId);

      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },

  /**
   * Get grade for a specific score
   */
  async getGradeForScore(subjId, score) {
    const subject = await SubjModel.fetchSubjById(subjId);
    if (!subject) {
      throw new Error("Subject not found");
    }

    if (score < 0 || score > 100) {
      throw new Error("Score must be between 0 and 100");
    }

    const grade = await SubjGradeModel.getGradeForScore(subjId, score);
    if (!grade) {
      throw new Error("No grade found for this score");
    }

    return {
      score,
      ...grade,
    };
  },

  async checkDuplicateGrades() {
    const duplicates = await SubjGradeModel.findDuplicateGrades();

    if (duplicates.length === 0) {
      return {
        hasDuplicates: false,
        totalDuplicates: 0,
        affectedSubjects: [],
        details: [],
      };
    }

    const subjectMap = new Map();
    let totalDuplicates = 0;

    for (const dup of duplicates) {
      const duplicateCount = dup.duplicateCount - 1;
      totalDuplicates += duplicateCount;

      if (!subjectMap.has(dup.subjId)) {
        subjectMap.set(dup.subjId, {
          subjId: dup.subjId,
          subjCode: dup.subjCode,
          subjDesc: dup.subjDesc,
          duplicateCount: 0,
          duplicateGroups: [],
        });
      }

      const subject = subjectMap.get(dup.subjId);
      subject.duplicateCount += duplicateCount;
      subject.duplicateGroups.push({
        gradeSeq: dup.gradeSeq,
        totalRecords: dup.duplicateCount,
        duplicatesToRemove: duplicateCount,
        gradeIds: dup.gradeIds ? dup.gradeIds.split(",").map(Number) : [],
      });
    }

    const affectedSubjects = Array.from(subjectMap.values());

    return {
      hasDuplicates: true,
      totalDuplicates,
      affectedSubjects,
      summary: {
        totalSubjectsAffected: affectedSubjects.length,
        totalDuplicateRecords: totalDuplicates,
      },
    };
  },

  async cleanDuplicateGrades() {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const duplicates = await SubjGradeModel.findDuplicateGrades();

      if (duplicates.length === 0) {
        await conn.commit();
        return {
          deletedCount: 0,
          affectedSubjects: [],
          details: [],
          summary: {
            totalSubjectsCleaned: 0,
            totalRecordsDeleted: 0,
          },
        };
      }

      let totalDeleted = 0;
      const affectedSubjectsSet = new Set();
      const cleanupDetails = [];

      for (const dup of duplicates) {
        const gradeIds = dup.gradeIds
          ? dup.gradeIds.split(",").map(Number)
          : [];

        if (gradeIds.length > 1) {
          const [keepId, ...deleteIds] = gradeIds;

          if (deleteIds.length > 0) {
            const deleted = await SubjGradeModel.deleteDuplicateGrades(
              conn,
              deleteIds,
            );

            totalDeleted += deleted;
            affectedSubjectsSet.add(dup.subjId);

            cleanupDetails.push({
              subjId: dup.subjId,
              subjCode: dup.subjCode,
              subjDesc: dup.subjDesc,
              gradeSeq: dup.gradeSeq,
              keptGradeId: keepId,
              deletedGradeIds: deleteIds,
              deletedCount: deleted,
            });
          }
        }
      }

      await conn.commit();

      const affectedSubjects = Array.from(affectedSubjectsSet);

      return {
        deletedCount: totalDeleted,
        affectedSubjects,
        details: cleanupDetails,
        summary: {
          totalSubjectsCleaned: affectedSubjects.length,
          totalRecordsDeleted: totalDeleted,
          cleanupGroups: cleanupDetails.length,
        },
      };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },

  async checkSubjectsWithoutGrades() {
    const subjects = await SubjGradeModel.findSubjectsWithoutGrades();
    const totalActiveSubjects = await SubjGradeModel.countActiveSubjects();

    if (subjects.length === 0) {
      return {
        count: 0,
        subjects: [],
        groupedBySeries: [],
        summary: {
          totalSubjectsChecked: totalActiveSubjects,
          subjectsWithoutGrades: 0,
          subjectsWithGrades: totalActiveSubjects,
          seriesAffected: 0,
          percentageWithoutGrades: 0,
        },
      };
    }

    const bySeries = subjects.reduce((acc, subj) => {
      const seriesKey = subj.seriesId || "no-series";

      if (!acc[seriesKey]) {
        acc[seriesKey] = {
          seriesId: subj.seriesId,
          seriesDesc: subj.seriesDesc || "No Series Assigned",
          subjectCount: 0,
          subjects: [],
        };
      }

      acc[seriesKey].subjectCount += 1;
      acc[seriesKey].subjects.push({
        subjId: subj.subjId,
        subjCode: subj.subjCode,
        subjDesc: subj.subjDesc,
        active: subj.active === 1,
      });

      return acc;
    }, {});

    const groupedBySeries = Object.values(bySeries);

    const percentageWithoutGrades =
      totalActiveSubjects > 0
        ? ((subjects.length / totalActiveSubjects) * 100).toFixed(2)
        : 0;

    return {
      count: subjects.length,
      subjects: subjects.map((subj) => ({
        subjId: subj.subjId,
        subjCode: subj.subjCode,
        subjDesc: subj.subjDesc,
        seriesId: subj.seriesId,
        seriesDesc: subj.seriesDesc,
        active: subj.active === 1,
      })),
      groupedBySeries,
      summary: {
        totalSubjectsChecked: totalActiveSubjects,
        subjectsWithoutGrades: subjects.length,
        subjectsWithGrades: totalActiveSubjects - subjects.length,
        seriesAffected: groupedBySeries.length,
        percentageWithoutGrades: parseFloat(percentageWithoutGrades),
      },
    };
  },
};

module.exports = subjGradeService;
