import api from "@/utils/api";
import { handleServiceError } from "@/utils/errorHandler";

const BASE_URL = "/api/dashboard";
export const dashboardService = {
  getDashboard: async (params) => {
    try {
      const response = await api.get(BASE_URL, {
        params,
      });
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to dashboard data");
    }
  },
};
