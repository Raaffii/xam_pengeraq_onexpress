import api from "@/utils/api";
import { handleServiceError } from "@/utils/errorHandler";

const BASE_URL = "/api/classlocation";
export const classLocationService = {
  getClassLocation: async () => {
    // const margedData = { data1, data2 };
    try {
      const response = await api.get(`${BASE_URL}`);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch location");
    }
  },
};
