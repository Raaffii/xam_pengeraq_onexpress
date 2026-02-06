import api from "@/utils/api";
import { handleServiceError } from "@/utils/errorHandler";

const BASE_URL = "/api/student-exams";
export const studentsExamSeriesService = {
  getStudentsExam: async (params) => {
    try {
      const response = await api.get(BASE_URL, {
        params,
      });
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch student exam");
    }
  },

  getStudentsExamSeriesById: async (studentId) => {
    try {
      const response = await api.get(`${BASE_URL}/${studentId}`);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch student exam");
    }
  },
};
