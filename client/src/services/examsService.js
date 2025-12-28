import api from "@/utils/api";
import { handleServiceError } from "@/utils/errorHandler";

const BASE_URL = "/api/exam";

export const examsService = {
  getExams: async (params) => {
    // const margedData = { data1, data2 };
    try {
      const response = await api.get(BASE_URL, {
        params,
      });
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch users");
    }
  },
  updateExams: async (id, data) => {
    // const margedData = { data1, data2 };
    try {
      const response = await api.put(`${BASE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch users");
    }
  },

  insertExams: async (data) => {
    // const margedData = { data1, data2 };

    try {
      const response = await api.post(BASE_URL, data);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch users");
    }
  },
  deleteExams: async (id) => {
    // const margedData = { data1, data2 };

    try {
      const response = await api.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch users");
    }
  },
};
