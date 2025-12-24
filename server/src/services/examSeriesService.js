const ExamSeries = require("../models/examSeriesModel");

const getExamSeries = async (page, limit, search) => {
  try {
    const result = await ExamSeries.getExamSeries(page, limit, search);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to register customer");
  }
};

const postExamSeries = async (data) => {
  try {
    const result = await ExamSeries.postExamSeries(data);
    return result;
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
};
