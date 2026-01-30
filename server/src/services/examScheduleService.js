const pool = require("../config/db");

const ClassSchedule = require("../models/classScheduleModel");
const ClassScheduleDetail = require("../models/classScheduleDetailsModel");

const addDateByRepeat = require("../utils/addDateByRepeat");

const getClassSchedule = async (options = {}) => {
  return await ClassSchedule.getClassSchedule(options);
};

const postClassSchedule = async (data, userId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const resultId = await ClassSchedule.postClassSchedule(
      connection,
      data,
      userId,
    );

    //start making loop
    const dataForBulk = [];

    let current = new Date(data.startDateTime);
    const end = new Date(data.endDateTime);
    end.setHours(23, 59, 59, 999);

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
      dataForBulk,
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

const getScheduleById = async (scheduleId) => {
  try {
    const result = await ClassSchedule.getScheduleById(scheduleId);

    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to get student by id");
  }
};

const putClassSchedule = async (id, data, userId) => {
  console.log("data", data);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Get existing schedule to compare changes
    const existingSchedule = await ClassSchedule.getClassScheduleById(
      connection,
      id,
    );

    if (!existingSchedule) {
      throw new Error("Class schedule not found");
    }

    // Update only changed fields in header
    await ClassSchedule.putClassSchedule(connection, id, data, userId);

    // Check if schedule details need to be regenerated
    const needsDetailRegeneration =
      (data.startDateTime !== undefined &&
        data.startDateTime !== existingSchedule.startdatetime) ||
      (data.endDateTime !== undefined &&
        data.endDateTime !== existingSchedule.enddatetime) ||
      (data.repeatValue !== undefined &&
        data.repeatValue !== existingSchedule.repeatValue) ||
      (data.repeatFreq !== undefined &&
        data.repeatFreq !== existingSchedule.repeatFreq);

    if (needsDetailRegeneration) {
      // Delete and regenerate schedule details
      await ClassScheduleDetail.deleteClassScheduleDetail(connection, id);

      const dataForBulk = [];
      const startDateTime =
        data.startDateTime || existingSchedule.startdatetime;
      const endDateTime = data.endDateTime || existingSchedule.enddatetime;
      const repeatValue =
        data.repeatValue !== undefined ?
          data.repeatValue
        : existingSchedule.repeatValue;
      const repeatFreq =
        data.repeatFreq !== undefined ?
          data.repeatFreq
        : existingSchedule.repeatFreq;

      let current = new Date(startDateTime);
      const end = new Date(endDateTime);
      end.setHours(23, 59, 59, 999);

      if (repeatFreq == 1) {
        while (current <= end) {
          dataForBulk.push({
            classchhdid: id,
            teacherId:
              data.teacherId !== undefined ?
                data.teacherId
              : existingSchedule.teacherid,
            examSeriesId:
              data.examSeriesId !== undefined ?
                data.examSeriesId
              : existingSchedule.examseriesid,
            examSubjId:
              data.examSubjId !== undefined ?
                data.examSubjId
              : existingSchedule.examsubjectid,
            locationId:
              data.locationId !== undefined ?
                data.locationId
              : existingSchedule.locationid,
            startDateTime: current.toISOString().slice(0, 16),
          });
          current = addDateByRepeat(current, repeatValue, repeatFreq);
        }
      } else {
        dataForBulk.push({
          classchhdid: id,
          teacherId:
            data.teacherId !== undefined ?
              data.teacherId
            : existingSchedule.teacherid,
          examSeriesId:
            data.examSeriesId !== undefined ?
              data.examSeriesId
            : existingSchedule.examseriesid,
          examSubjId:
            data.examSubjId !== undefined ?
              data.examSubjId
            : existingSchedule.examsubjectid,
          locationId:
            data.locationId !== undefined ?
              data.locationId
            : existingSchedule.locationid,
          startDateTime: current.toISOString().slice(0, 16),
        });
      }

      await ClassScheduleDetail.bulkInsertScheduleDetail(
        connection,
        dataForBulk,
      );
    } else if (
      data.teacherId !== undefined ||
      data.examSeriesId !== undefined ||
      data.examSubjId !== undefined ||
      data.locationId !== undefined
    ) {
      await ClassScheduleDetail.updateClassScheduleDetailFields(
        connection,
        id,
        {
          teacherId: data.teacherId,
          examSeriesId: data.examSeriesId,
          examSubjId: data.examSubjId,
          locationId: data.locationId,
        },
      );
    }

    await connection.commit();
    return { success: true };
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
  getScheduleById,
};
