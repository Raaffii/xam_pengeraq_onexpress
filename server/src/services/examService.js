const Exam = require("../models/examModel");

const ExamService = {
  async getExam(options) {
    return await Exam.getExam(options);
  },

  async getExamById(examId) {
    const result = await Exam.getExamById(examId);

    if (!result) {
      throw new Error("Exam not found");
    }

    return result;
  },

  async postExam(data) {
    try {
      const result = await Exam.postExam(data);
      return result;
    } catch (error) {
      console.error("Service error:", error);
      throw error;
    }
  },

  async putExam(id, data) {
    try {
      const result = await Exam.putExam(id, data);

      if (!result) {
        throw new Error("Exam not found");
      }

      return result;
    } catch (error) {
      console.error("Service error:", error);
      throw error;
    }
  },

  async deleteExam(id) {
    try {
      const result = await Exam.deleteExam(id);
      return result;
    } catch (error) {
      console.error("Service error:", error);
      throw error;
    }
  },
};

module.exports = ExamService;
