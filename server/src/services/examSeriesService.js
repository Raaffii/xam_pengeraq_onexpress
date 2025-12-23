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

module.exports = {
  getExamSeries,
};
