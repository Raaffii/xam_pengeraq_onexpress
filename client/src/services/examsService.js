import api from "@/utils/api";
import { handleServiceError } from "@/utils/errorHandler";

const BASE_URL = "/api/exams";

export const examsService = {
  getExams: async (params) => {
    try {
      const response = await api.get(BASE_URL, {
        params,
      });
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch exams");
    }
  },

  getExamsById: async (examId) => {
    try {
      const response = await api.get(`${BASE_URL}/${examId}`);

      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch exams");
    }
  },
  updateExams: async (id, data) => {
    try {
      const response = await api.put(`${BASE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to update exam");
    }
  },

  insertExams: async (data) => {
    try {
      const response = await api.post(BASE_URL, data);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to create exam");
    }
  },
  deleteExams: async (id) => {
    try {
      const response = await api.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to delete exam");
    }
  },
};
