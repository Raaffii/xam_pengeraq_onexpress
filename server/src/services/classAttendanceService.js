const ClassAttendance = require("../models/classAttendanceModel");

const getClassAttendance = async (page, limit, searchTerm, filter) => {
  try {
    const result = await ClassAttendance.getClassAttendance(
      page,
      limit,
      searchTerm,
      filter,
    );
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to get student by id");
  }
};

module.exports = {
  getClassAttendance,
};
