const pool = require("../config/db");
const { defaultExamFinalGrades } = require("../utils/data");

const DashboardModel = {
  async getExamResultsBySeries(examSeriesId, options = {}) {
    const { page, pageSize, searchTerm } = options;
    const conn = await pool.getConnection();

    try {
      let whereClause = `WHERE er.examseriesid = ? 
          AND s.active = 1
          AND er.active = 1`;
      const queryParams = [examSeriesId];

      if (searchTerm && searchTerm.trim()) {
        whereClause += ` AND (s.studentname LIKE ? OR s.studentidno LIKE ?)`;
        const searchPattern = `%${searchTerm.trim()}%`;
        queryParams.push(searchPattern, searchPattern);
      }

      // Get exam series credits once
      const [seriesData] = await conn.query(
        `SELECT credits FROM examseries WHERE examseriesid = ? AND active = 1`,
        [examSeriesId],
      );

      if (!seriesData || seriesData.length === 0) {
        return { data: [], total: 0 };
      }

      const credits = parseFloat(seriesData[0].credits);

      // Get total count
      const countParams = queryParams.slice(0, searchTerm ? 3 : 1);
      const [countResult] = await conn.query(
        `SELECT COUNT(DISTINCT s.studentid) as total
        FROM students s
        INNER JOIN examresults er ON s.studentid = er.studentid
        ${whereClause}`,
        countParams,
      );

      const total = countResult[0].total;

      // Step 1: Get paginated student IDs first
      let studentLimitClause = "";
      const studentQueryParams = [...queryParams];

      if (page && pageSize) {
        const offset = (page - 1) * pageSize;
        studentLimitClause = `LIMIT ? OFFSET ?`;
        studentQueryParams.push(String(pageSize, 10), String(offset, 10));
      }

      const [paginatedStudents] = await conn.execute(
        `SELECT DISTINCT
          s.studentid,
          s.studentname,
          s.studentidno
        FROM students s
        INNER JOIN examresults er ON s.studentid = er.studentid
        ${whereClause}
        ORDER BY s.studentname ASC
        ${studentLimitClause}`,
        studentQueryParams,
      );

      if (paginatedStudents.length === 0) {
        return { data: [], total };
      }

      // Get student IDs for the next query
      const studentIds = paginatedStudents.map((s) => s.studentid);

      // Step 2: Get all results for specific students
      const placeholders = studentIds.map(() => "?").join(",");
      const [allResults] = await conn.query(
        `SELECT 
          er.studentid,
          er.examresultsid as resultId,
          er.examsubjid as subjId,
          s.subjdesc as subjDesc,
          s.subjcode as subjCode,
          er.marks,
          er.subjgpa as subjGpa,
          er.subjgrade as subjGrade,
          er.subjresults as subjResult,
          s.subjearncredit AS subjCredit,
          er.retake as isRetake,
          er.createddate as createdDate,
          er.editeddate as editedDate
        FROM examresults er
        LEFT JOIN examsubj s ON er.examsubjid = s.examsubjid
        WHERE er.studentid IN (${placeholders})
          AND er.examseriesid = ?
          AND er.active = 1
          AND s.active = 1
        ORDER BY er.studentid, er.examsubjid`,
        [...studentIds, examSeriesId],
      );

      // Step 3: Get all grade configurations
      const [gradeConfigs] = await conn.query(
        `SELECT 
          finalpercent as finalPercent,
          overallgrade as grade,
          overallgradepoint as gradePoint,
          overallrank as gradeResult
        FROM examfinalgrade
        WHERE examseriesid = ?
          AND active = 1
        ORDER BY examfinalgradeseq ASC`,
        [examSeriesId],
      );

      // Group results by student
      const resultsMap = new Map();
      allResults.forEach((row) => {
        if (!resultsMap.has(row.studentid)) {
          resultsMap.set(row.studentid, []);
        }
        resultsMap.get(row.studentid).push({
          resultId: row.resultId,
          subjId: row.subjId,
          subjDesc: row.subjDesc,
          subjCode: row.subjCode,
          subjCredit: row.subjCredit,
          marks: parseFloat(row.marks),
          subjGpa: parseFloat(row.subjGpa),
          subjGrade: row.subjGrade,
          subjResult: row.subjResult,
          isRetake: Boolean(row.isRetake),
          createdDate: row.createdDate,
          editedDate: row.editedDate,
        });
      });

      const studentsWithResults = paginatedStudents.map((student) => {
        const results = resultsMap.get(student.studentid) || [];
        const summary = this.calculateOverallGradeFromResults(
          results,
          credits,
          gradeConfigs,
        );

        return {
          studentId: student.studentid,
          studentName: student.studentname,
          studentIdNo: student.studentidno,
          summary,
          results,
        };
      });

      return {
        data: studentsWithResults,
        total,
      };
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      conn.release();
    }
  },

  calculateOverallGradeFromResults(results, credits, gradeConfigs) {
    const config =
      gradeConfigs.length > 0 ? gradeConfigs : defaultExamFinalGrades;
    if (!results || results.length === 0) {
      return {
        overallGrade: null,
        overallGradePoint: null,
        gradeResult: null,
        totalMarks: 0,
      };
    }

    // Calculate total marks with retake cap applied
    const totalMarks = results.reduce((sum, r) => {
      let mark = parseFloat(r.marks || 0);
      if (r.isRetake && mark > 50) {
        mark = 50;
      }
      return sum + mark;
    }, 0);

    const overallGradePoint = parseFloat((totalMarks / credits).toFixed(2));

    const gradeConfig = config.find(
      (config) =>
        parseFloat(config.gradePoint) >=
        (overallGradePoint >= 4.0 ? 4.0 : overallGradePoint),
    );

    // console.log("results", results);
    // console.log("total marks", totalMarks);
    // console.log("overallGradePoint", overallGradePoint);
    // console.log("config", config);
    // console.log("gradeConfig", gradeConfig);

    if (gradeConfig) {
      return {
        overallGrade: gradeConfig.grade,
        overallGradePoint:
          overallGradePoint > 4 ? parseFloat(4).toFixed(2) : overallGradePoint,
        gradeResult: gradeConfig.gradeResult,
        totalMarks: parseFloat(totalMarks.toFixed(2)),
      };
    }

    return {
      overallGrade: "F",
      overallGradePoint: overallGradePoint >= 4.0 ? 4.0 : overallGradePoint,
      gradeResult: "GAGAL",
      totalMarks: parseFloat(totalMarks.toFixed(2)),
    };
  },
};

module.exports = DashboardModel;
