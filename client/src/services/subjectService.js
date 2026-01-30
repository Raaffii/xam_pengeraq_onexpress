import api from "@/utils/api";
import { handleServiceError } from "@/utils/errorHandler";

const BASE_URL = "/api/subject";
export const subjectService = {
  getSubjectByExamSeriesId: async (examSeriesId) => {
    // const margedData = { data1, data2 };
    try {
      const response = await api.get(`${BASE_URL}/${examSeriesId}`);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch subject");
    }
  },
};
