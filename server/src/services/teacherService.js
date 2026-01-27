const Teacher = require("../models/teacherModel");

const getTeacher = async (page, limit, searchTerm) => {
  try {
    const result = await Teacher.getTeacher(page, limit, searchTerm);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to get student exam series");
  }
};

const postTeacher = async (data) => {
  try {
    const result = await Teacher.postTeacher(data);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to get student exam series");
  }
};

const putTeacher = async (data, id) => {
  try {
    const result = await Teacher.putTeacher(data, id);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to get student exam series");
  }
};

const getTeacherById = async (id) => {
  try {
    const result = await Teacher.getTeacherById(id);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to get student exam series");
  }
};

const deleteTeacher = async (id) => {
  try {
    const result = await Teacher.deleteTeacher(id);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw error;
  }
};

module.exports = {
  getTeacher,
  postTeacher,
  putTeacher,
  getTeacherById,
  deleteTeacher,
};
