const Students = require("../models/studentModel");

const getStudent = async (page, limit, search) => {
  try {
    const result = await Students.getStudent(page, limit, search);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to register customer");
  }
};

const postStudent = async (data) => {
  try {
    const result = await Students.postStudent(data);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw error;
  }
};

module.exports = {
  getStudent,
  postStudent,
};
