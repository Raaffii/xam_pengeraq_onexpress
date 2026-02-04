const pool = require("../config/db");
const Students = require("../models/studentModel");
const StudentExam = require("../models/studentExamModel");
const { findMemberByEmail } = require("./memberApiService");

const studentService = {
  async getStudent(options = {}) {
    const result = await Students.getStudent(options);

    if (!options.isMember || result.data.length === 0) {
      return result;
    }

    const emailAddress = result.data.map((s) => s.studentEmail).filter(Boolean);

    if (emailAddress.length === 0) {
      return result;
    }

    const memberResponse = await findMemberByEmail(
      JSON.stringify({
        emailAddress,
      }),
    );

    const memberMap = new Map(
      memberResponse.data.map((m) => [m.emailAddress, m]),
    );

    result.data = result.data.map((student) => {
      const memberInfo = memberMap.get(student.studentEmail);

      return {
        ...student,
        member:
          memberInfo ?
            {
              status: memberInfo.status,
              memberId: memberInfo.memberId,
              memberName: memberInfo.memberName,
              memberEmail: memberInfo.memberEmail,
              isMemberApproved: memberInfo.isMemberApproved,
            }
          : {
              status: "NOT_FOUND",
              memberId: null,
              memberName: null,
              memberEmail: null,
              isMemberApproved: null,
            },
      };
    });

    return result;
  },

  async getStudentById(studentId) {
    const result = await Students.getStudentById(studentId);
    if (!result) {
      throw new Error("Student not found");
    }

    return result;
  },

  async postStudent(data, userId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const studentId = await Students.postStudent(connection, data, userId);
      let result;
      if (Array.isArray(data.examSeries) && data.examSeries.length > 0) {
        result = await StudentExam.postStudentExam(connection, {
          examSeriesIds: data.examSeries,
          studentId,
          userId,
        });
      }
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      console.error("Service error:", error);
      throw error;
    } finally {
      connection.release();
    }
  },

  async putStudent(id, data, userId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await Students.putStudent(connection, id, data, userId);

      if (Array.isArray(data.examSeries) && data.examSeries.length > 0) {
        await StudentExam.deleteByStudentId(connection, id);
        await StudentExam.postStudentExam(connection, {
          examSeriesIds: data.examSeries,
          studentId: id,
          userId,
        });
      }

      await connection.commit();

      return result;
    } catch (error) {
      await connection.rollback();
      console.error("Service error:", error);
      throw error;
    } finally {
      connection.release();
    }
  },

  async deleteStudent(id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await StudentExam.deleteByStudentId(connection, id);
      const result = await Students.deleteStudent(connection, id);

      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      console.error("Service error:", error);
      throw error;
    } finally {
      connection.release();
    }
  },
};

module.exports = studentService;
