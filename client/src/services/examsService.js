import { authService } from "./authService";
import api from "@/utils/api";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const examsService = {
  getExams: async (params) => {
    // const margedData = { data1, data2 };
    const token = authService.getToken();
    try {
      const response = await api.get(`${API_BASE_URL}/api/exam`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetch", error);
      return error;
    }
  },
  updateExams: async (id, data) => {
    // const margedData = { data1, data2 };
    const token = authService.getToken();
    try {
      const response = await api.put(`${API_BASE_URL}/api/exam/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error update", error);
      return error;
    }
  },

  insertExams: async (data) => {
    // const margedData = { data1, data2 };
    const token = authService.getToken();
    try {
      const response = await api.post(`${API_BASE_URL}/api/exam`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error insert", error);
      throw error;
    }
  },
  deleteExams: async (id) => {
    // const margedData = { data1, data2 };

    const token = authService.getToken();
    try {
      const response = await api.delete(`${API_BASE_URL}/api/exam/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error delete", error);
      return error;
    }
  },
};
