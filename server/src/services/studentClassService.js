const StudentClass = require("../models/studentClassModel");

const getStudentClass = async (page, limit, searchTerm, schedule) => {
  try {
    const result = await StudentClass.getStudentClass(
      page,
      limit,
      searchTerm,
      schedule
    );
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Get exam failed");
  }
};

module.exports = {
  getStudentClass,
};
