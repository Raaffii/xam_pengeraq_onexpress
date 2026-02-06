import api from "@/utils/api";
import { handleServiceError } from "@/utils/errorHandler";

const BASE_URL = "/api/teacher";
export const teacherService = {
  getTeacher: async (params) => {
    try {
      const response = await api.get(`${BASE_URL}`, { params });
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch teacher");
    }
  },

  insertTeacher: async (data) => {
    try {
      const response = await api.post(BASE_URL, data);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to create teacher");
    }
  },
  updateTeacher: async (data, id) => {
    try {
      const response = await api.put(`${BASE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to create teacher");
    }
  },
  deleteTeacher: async (id) => {
    try {
      const response = await api.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to create teacher");
    }
  },
};
