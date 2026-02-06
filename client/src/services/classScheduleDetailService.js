import api from "@/utils/api";
import { handleServiceError } from "@/utils/errorHandler";

const BASE_URL = "/api/classscheduledetail";
export const classScheduleDetailService = {
  getClassScheduleDetail: async (params) => {
    // const margedData = { data1, data2 };
    try {
      const response = await api.get(BASE_URL, {
        params,
      });
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch schedule detail");
    }
  },

  getClassScheduleDetailById: async (scheduleDetailId) => {
    // const margedData = { data1, data2 };
    try {
      const response = await api.get(`${BASE_URL}/${scheduleDetailId}`);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch schedule detail");
    }
  },

  startClassSession: async (classschhdid) => {
    try {
      const response = await api.put(
        `${BASE_URL}/classsession/${classschhdid}`,
      );

      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch schedule detail");
    }
  },

  openClassSession: async (classschhdid) => {
    try {
      const response = await api.get(
        `${BASE_URL}/classsession/${classschhdid}`,
      );

      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch schedule detail");
    }
  },
};
