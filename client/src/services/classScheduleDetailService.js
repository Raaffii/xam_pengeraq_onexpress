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
      handleServiceError(error, "Failed to fetch student");
    }
  },
};
