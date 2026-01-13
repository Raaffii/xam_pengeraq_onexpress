import api from "@/utils/api";
import { handleServiceError } from "@/utils/errorHandler";

const BASE_URL = "/api/teacher";
export const teacherService = {
  getTeacher: async () => {
    // const margedData = { data1, data2 };
    try {
      const response = await api.get(`${BASE_URL}`);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch student");
    }
  },
};
