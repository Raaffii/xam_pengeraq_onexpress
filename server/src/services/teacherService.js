const Teacher = require("../models/teacherModel");

const getTeacher = async () => {
  try {
    const result = await Teacher.getTeacher();
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to get student exam series");
  }
};

module.exports = {
  getTeacher,
};
