const ClassScheduleDetail = require("../models/classScheduleDetailsModel");

const getClassScheduleDetail = async (options = {}) => {
  return await ClassScheduleDetail.getClassScheduleDetail(options);
};

const getClassScheduleDetailById = async (classSchDetailsId) => {
  try {
    const result =
      await ClassScheduleDetail.getClassScheduleDetailById(classSchDetailsId);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to get student by id");
  }
};

const startClassSession = async (classschhdid, hashToken, newClass = true) => {
  try {
    const result = await ClassScheduleDetail.startClassSession(
      classschhdid,
      hashToken,
      newClass,
    );
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw error;
  } finally {
  }
};

const newTokenClassSession = async (classschhdid) => {
  try {
    const result = await ClassScheduleDetail.newTokenClassSession(classschhdid);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw error;
  } finally {
  }
};

const openClassSession = async (classschhdid, hashToken) => {
  try {
    const result = await ClassScheduleDetail.openClassSession(
      classschhdid,
      hashToken,
    );

    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw error;
  } finally {
  }
};

module.exports = {
  getClassScheduleDetail,
  startClassSession,
  openClassSession,
  newTokenClassSession,
  getClassScheduleDetailById,
};
