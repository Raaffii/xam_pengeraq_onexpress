import { authService } from "./authService";
import api from "@/utils/api";

const API_BASE_URL = import.meta.env.VITE_API_URL;
import { handleServiceError } from "@/utils/errorHandler";

const BASE_URL = "/api/examseries";
export const examSeriesService = {
  getExamSeries: async (params) => {
    // const margedData = { data1, data2 };
    const token = authService.getToken();
    try {
      const response = await api.get(`${API_BASE_URL}/api/examseries`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error registation", error);
      return error;
    }
  },
  insertExamSeries: async (data) => {
    try {
      const response = await api.post(BASE_URL, data);
      return response.data;
    } catch (error) {
      handleServiceError("Error registation", error);
    }
  },

  updateExamsSeries: async (id, data) => {
    try {
      const response = await api.put(`${BASE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      handleServiceError("Error registation", error);
    }
  },

  deleteExamSeries: async (id) => {
    try {
      const response = await api.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      handleServiceError("Error registation", error);
    }
  },
};
