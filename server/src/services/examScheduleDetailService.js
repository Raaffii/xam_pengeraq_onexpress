const ClassScheduleDetail = require("../models/classScheduleDetailsModel");

const getClassScheduleDetail = async (page, limit, searchTerm, date) => {
  try {
    const result = await ClassScheduleDetail.getClassScheduleDetail(
      page,
      limit,
      searchTerm,
      date
    );
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to get student by id");
  }
};

module.exports = {
  getClassScheduleDetail,
};
