import { authService } from "./authService";
import api from "@/utils/api";

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
};
