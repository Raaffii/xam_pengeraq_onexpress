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
};
