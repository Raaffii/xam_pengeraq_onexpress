import api from "@/utils/api";

import { handleServiceError } from "@/utils/errorHandler";

const BASE_URL = "/api/exam-results";

export const examResultService = {
  getExamResult: async (params) => {
    try {
      const response = await api.get(BASE_URL, {
        params,
      });
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch users");
    }
  },
  postExamResult: async (data) => {
    try {
      const response = await api.post(BASE_URL, data);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to create exam result");
    }
  },

  putExamResult: async (id, data) => {
    try {
      const response = await api.put(`${BASE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to update student");
    }
  },

  deleteExamResult: async (id) => {
    try {
      const response = await api.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to update student");
    }
  },
};
