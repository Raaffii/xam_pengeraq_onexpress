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

const postStudentClass = async (data) => {
  try {
    let addResult = null;
    let removeResult = null;

    if (Array.isArray(data.addStudents) && data.addStudents.length > 0) {
      addResult = await StudentClass.postStudentClass(
        data.scheduleId,
        data.addStudents
      );
    }

    if (Array.isArray(data.removeStudents) && data.removeStudents.length > 0) {
      removeResult = await StudentClass.removeStudentFromClass(
        data.scheduleId,
        data.removeStudents
      );
    }

    return {
      added: addResult,
      removed: removeResult,
    };
  } catch (error) {
    console.error("Service error:", error);
    throw error;
  } finally {
  }
};

module.exports = {
  getStudentClass,
  postStudentClass,
};
