import api from "@/utils/api";

import { handleServiceError } from "@/utils/errorHandler";

const BASE_URL = "/api/examresult";

export const examResultService = {
  getExamResult: async (params, studentID) => {
    // const margedData = { data1, data2 };
    try {
      const response = await api.get(`${BASE_URL}/${studentID}`, {
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
    console.log("dadada", id, data);
    try {
      const response = await api.put(`${BASE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to update student");
    }
  },

  deleteExamResult: async (id) => {
    try {
      console.log("id", id);
      const response = await api.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to update student");
    }
  },
};
