const ExamSeries = require("../models/examSeriesModel");
const SubjGradeModel = require("../models/subjGradeModel");
const ExamFinalGradeModel = require("../models/examFinalGradeModel");

const getExamSeries = async (page, limit, searchTerm, byExam, examId) => {
  try {
    const result = await ExamSeries.getExamSeries(
      page,
      limit,
      searchTerm,
      byExam,
      examId
    );
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to get Exam Series");
  }
};

const getExamSeriesById = async (examSeriesById) => {
  try {
    const result = await ExamSeries.getExamSeriesById(examSeriesById);

    if (!result) {
      const err = new Error("Exam Series not found");
      err.statusCode = 404;
      throw err;
    }

    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to get exam series by id");
  }
};

const postExamSeries = async (data) => {
  try {
    const resultInsertId = await ExamSeries.postExamSeries(data);

    if (data.importExamSeries) {
      const examSeriesId = data.importExamSeries;
      //import subjgrade---------
      const subjGradeByExamSeries =
        await SubjGradeModel.findGradesByExamSeriesId(data.importExamSeries);

      // console.log("data by examSeries", subjGradeByExamSeries);

      //import examgrade--------
      const examFinalGradeByExamSeries =
        await ExamFinalGradeModel.examGradeByExamSeriesId(examSeriesId);

      await ExamFinalGradeModel.bulkInsert(
        resultInsertId,
        examFinalGradeByExamSeries
      );
      // console.log(
      //   "data exam series final grademodel",
      //   examFinalGradeByExamSeries
      // );

      //import examsubj----------
    }

    return resultInsertId;
  } catch (error) {
    console.error("Service error:", error);

    throw error;
  }
};

const putExamSeries = async (id, data) => {
  try {
    const result = await ExamSeries.putExamSeries(id, data);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw error;
  }
};

const deleteExamSeries = async (data) => {
  try {
    const result = await ExamSeries.deleteExamSeries(data);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw error;
  }
};

module.exports = {
  getExamSeries,
  postExamSeries,
  putExamSeries,
  deleteExamSeries,
  getExamSeriesById,
};
