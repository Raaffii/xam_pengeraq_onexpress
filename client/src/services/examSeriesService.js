import api from "@/utils/api";

import { handleServiceError } from "@/utils/errorHandler";

const BASE_URL = "/api/examseries";

export const examSeriesService = {
  getExamSeries: async (params) => {
    // const margedData = { data1, data2 };
    try {
      const response = await api.get(BASE_URL, {
        params,
      });
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch series");
    }
  },

  getExamSeriesById: async (examSeriesId) => {
    try {
      const response = await api.get(`${BASE_URL}/${examSeriesId}`);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch series");
    }
  },

  insertExamSeries: async (data) => {
    try {
      const response = await api.post(BASE_URL, data);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Internal Server Error");
    }
  },

  updateExamsSeries: async (id, data) => {
    try {
      const response = await api.put(`${BASE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Internal Server Error");
    }
  },

  deleteExamSeries: async (id) => {
    try {
      const response = await api.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Internal Server Error");
    }
  },
};
