import api from "@/utils/api";
import { handleServiceError } from "@/utils/errorHandler";

const BASE_URL = "/api/subject";
export const subjectGradeService = {
  getSubjectGradeByExamSubj: async (subjectId) => {
    // const margedData = { data1, data2 };
    try {
      const response = await api.get(`${BASE_URL}/${subjectId}/grades`);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch student");
    }
  },
};
