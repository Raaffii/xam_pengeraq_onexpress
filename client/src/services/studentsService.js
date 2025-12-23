import { authService } from "./authService";
import api from "@/utils/api";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const studentService = {
  getStudents: async (params) => {
    // const margedData = { data1, data2 };
    const token = authService.getToken();
    try {
      const response = await api.get(`${API_BASE_URL}/api/student`, {
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

  insertStudents: async (data) => {
    // const margedData = { data1, data2 };
    const token = authService.getToken();
    try {
      const response = await api.post(`${API_BASE_URL}/api/student`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error registation", error);
      throw error;
    }
  },
};
