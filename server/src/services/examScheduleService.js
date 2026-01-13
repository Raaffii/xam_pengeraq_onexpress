const pool = require("../config/db");

const Students = require("../models/studentModel");

const ClassSchedule = require("../models/classScheduleModel");
const ClassScheduleDetail = require("../models/classScheduleDetailsModel");

const addDateByRepeat = require("../utils/addDateByRepeat");

const getClassSchedule = async (page, limit, searchTerm, date) => {
  try {
    const result = await ClassSchedule.getClassSchedule(
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

const postClassSchedule = async (data, userId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    console.log("data", data);

    const resultId = await ClassSchedule.postClassSchedule(
      connection,
      data,
      userId
    );

    //start making loop
    const dataForBulk = [];

    let current = new Date(data.startDateTime);
    const end = new Date(data.endDateTime);

    if (data.repeatFreq == 1) {
      while (current <= end) {
        dataForBulk.push({
          classchhdid: resultId,
          teacherId: data.teacherId,
          examSeriesId: data.examSeriesId,
          examSubjId: data.examSubjId,
          locationId: data.locationId,
          startDateTime: current.toISOString().slice(0, 16),
        });

        current = addDateByRepeat(current, data.repeatValue, data.repeatFreq);
      }
    } else {
      dataForBulk.push({
        classchhdid: resultId,
        teacherId: data.teacherId,
        examSeriesId: data.examSeriesId,
        examSubjId: data.examSubjId,
        locationId: data.locationId,
        startDateTime: current.toISOString().slice(0, 16),
      });
    }

    const result = await ClassScheduleDetail.bulkInsertScheduleDetail(
      connection,
      dataForBulk
    );

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    console.error("Service error:", error);
    throw error;
  } finally {
    connection.release();
  }
};

const getStudentById = async (studentId) => {
  try {
    const result = await Students.getStudentById(studentId);

    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to get student by id");
  }
};

const putClassSchedule = async (id, data, userId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await ClassSchedule.putClassSchedule(connection, id, data, userId);

    // change ig only date change ---------------------------------------
    await ClassScheduleDetail.deleteClassScheduleDetail(connection, id);

    //start making loop
    const dataForBulk = [];

    let current = new Date(data.startDateTime);
    const end = new Date(data.endDateTime);

    if (data.repeatFreq == 1) {
      while (current <= end) {
        dataForBulk.push({
          classchhdid: id,
          teacherId: data.teacherId,
          examSeriesId: data.examSeriesId,
          examSubjId: data.examSubjId,
          locationId: data.locationId,
          startDateTime: current.toISOString().slice(0, 16),
        });

        current = addDateByRepeat(current, data.repeatValue, data.repeatFreq);
      }
    } else {
      dataForBulk.push({
        classchhdid: id,
        teacherId: data.teacherId,
        examSeriesId: data.examSeriesId,
        examSubjId: data.examSubjId,
        locationId: data.locationId,
        startDateTime: current.toISOString().slice(0, 16),
      });
    }

    const result = await ClassScheduleDetail.bulkInsertScheduleDetail(
      connection,
      dataForBulk
    );

    // change ig only date change ---------------------------------------

    await connection.commit();

    return result;
  } catch (error) {
    await connection.rollback();
    console.error("Service error:", error);
    throw error;
  } finally {
    connection.release();
  }
};

const deleteClassSchedule = async (id) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await ClassScheduleDetail.deleteClassScheduleDetail(connection, id);
    const result = await ClassSchedule.deleteClassSchedule(connection, id);

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    console.error("Service error:", error);
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  getClassSchedule,
  postClassSchedule,
  putClassSchedule,
  deleteClassSchedule,
  getStudentById,
};
