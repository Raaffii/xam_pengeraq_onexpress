import api from "@/utils/api";
import { handleServiceError } from "@/utils/errorHandler";

const BASE_URL = "/api/student";
export const studentService = {
  getStudents: async (params) => {
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

  getStudentsById: async (studentId) => {
    // const margedData = { data1, data2 };
    try {
      const response = await api.get(`${BASE_URL}/${studentId}`);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch student");
    }
  },

  updateStudent: async (id, data) => {
    // const margedData = { data1, data2 };

    try {
      const response = await api.put(`${BASE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to update student");
    }
  },

  insertStudents: async (data) => {
    // const margedData = { data1, data2 };

    try {
      const response = await api.post(BASE_URL, data);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to create student");
    }
  },
  deleteStudents: async (id) => {
    // const margedData = { data1, data2 };

    try {
      const response = await api.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to delete student");
    }
  },
};
