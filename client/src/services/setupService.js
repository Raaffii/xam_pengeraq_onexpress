import api from "@/utils/api";
import { handleServiceError } from "@/utils/errorHandler";

const BASE_URL = "/api/setups";

export const setupService = {
  getSetup: async (params) => {
    try {
      const response = await api.get(BASE_URL, {
        params,
      });
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch setup");
    }
  },
  getSetupById: async (setupId) => {
    try {
      const response = await api.get(`${BASE_URL}/${setupId}`);

      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch setup");
    }
  },
  updateSetup: async (id, data) => {
    try {
      const response = await api.put(`${BASE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to update setup");
    }
  },

  insertSetup: async (data) => {
    try {
      const response = await api.post(BASE_URL, data);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to create setup");
    }
  },
  deleteSetup: async (id) => {
    try {
      const response = await api.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to delete setup");
    }
  },

  getSetupData: () => JSON.parse(localStorage.getItem("setup")),

  setSetupData: (setup) => {
    console.log(setup);
    localStorage.setItem("setup", JSON.stringify(setup));
  },

  removeSetupData: () => localStorage.removeItem("user"),
};
