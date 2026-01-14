const ClassScheduleDetail = require("../models/classScheduleDetailsModel");

const getClassScheduleDetail = async (
  page,
  limit,
  searchTerm,
  date,
  teacherId,
  scheduleId,
  nowDate
) => {
  try {
    const result = await ClassScheduleDetail.getClassScheduleDetail(
      page,
      limit,
      searchTerm,
      date,
      teacherId,
      scheduleId,
      nowDate
    );
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to get student by id");
  }
};

const startClassSession = async (classschhdid, hashToken) => {
  try {
    const result = await ClassScheduleDetail.startClassSession(
      classschhdid,
      hashToken
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
      hashToken
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
};
