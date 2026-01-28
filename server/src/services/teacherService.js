const Teacher = require("../models/teacherModel");

const getTeacher = async (options = {}) => {
  return await Teacher.getTeacher(options);
};

const postTeacher = async (data) => {
  return await Teacher.postTeacher(data);
};

const putTeacher = async (data, id) => {
  const res = await Teacher.putTeacher(data, id);
  if (!res) {
    throw new Error("Teacher not found");
  }

  return res;
};

const getTeacherById = async (id) => {
  return await Teacher.getTeacherById(id);
};

const deleteTeacher = async (id) => {
  const res = await Teacher.deleteTeacher(id);
  if (!res) {
    throw new Error("Teacher not found");
  }

  return res;
};

module.exports = {
  getTeacher,
  postTeacher,
  putTeacher,
  getTeacherById,
  deleteTeacher,
};
