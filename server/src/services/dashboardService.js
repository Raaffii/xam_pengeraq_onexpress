const DashboardModel = require("../models/dashboardModel");
const SeriesModel = require("../models/examSeriesModel");

const dashboardService = {
  async getExam(id, options) {
    const seriesInfo = await SeriesModel.getSeriesById(id);
    if (!seriesInfo) {
      throw new Error("Exam series not found");
    }

    return await DashboardModel.getExamResultsBySeries(id, options);
  },
};

module.exports = dashboardService;
