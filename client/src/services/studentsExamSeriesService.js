import api from "@/utils/api";
import { handleServiceError } from "@/utils/errorHandler";

const BASE_URL = "/api/studentexam";
export const studentsExamSeriesService = {
  getStudentsExam: async (params) => {
    // const margedData = { data1, data2 };
    try {
      const response = await api.get(BASE_URL, {
        params,
      });
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch student");
    }
  },

  getStudentsExamSeriesById: async (studentId) => {
    // const margedData = { data1, data2 };
    try {
      const response = await api.get(`${BASE_URL}/${studentId}`);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch student");
    }
  },
};
