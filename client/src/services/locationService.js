import api from "@/utils/api";
import { handleServiceError } from "@/utils/errorHandler";

const BASE_URL = "/api/location";
export const locationService = {
  getLocation: async (params) => {
    // const margedData = { data1, data2 };
    try {
      const response = await api.get(`${BASE_URL}`, { params });
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch location");
    }
  },

  insertlocation: async (data) => {
    try {
      const response = await api.post(BASE_URL, data);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to create Location");
    }
  },
  updateLocation: async (data, id) => {
    try {
      const response = await api.put(`${BASE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to create Location");
    }
  },
  deleteLocation: async (id) => {
    try {
      const response = await api.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to create Location");
    }
  },
};
