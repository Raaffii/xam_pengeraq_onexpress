import api from "@/utils/api";
import { handleServiceError } from "@/utils/errorHandler";

const BASE_URL = "/api/users";

export const userService = {
  getUsers: async (params) => {
    try {
      const response = await api.get(BASE_URL, {
        params,
      });
      return response.data;
    } catch (error) {
      handleServiceError("Error registation", error);
    }
  },

  insertUser: async (data) => {
    try {
      const response = await api.post(BASE_URL, data);
      return response.data;
    } catch (error) {
      handleServiceError("Error registation", error);
    }
  },

  putUser: async (userId, data) => {
    try {
      const response = await api.put(`${BASE_URL}/${userId}`, data);
      return response.data;
    } catch (error) {
      handleServiceError("Error registation", error);
    }
  },

  removeUser: async (userId) => {
    try {
      const response = await api.delete(`${BASE_URL}/${userId}`);
      return response.data;
    } catch (error) {
      handleServiceError("Error registation", error);
    }
  },
};
