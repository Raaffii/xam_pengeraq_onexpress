import api from "@/utils/api";
import { handleServiceError } from "@/utils/errorHandler";

const BASE_URL = "/api/subject";

export const subjectService = {
  getSubjects: async (params) => {
    try {
      const response = await api.get(BASE_URL, {
        params,
      });
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch subjects");
    }
  },

  getSubjGrades: async (subjectId) => {
    try {
      const response = await api.get(`${BASE_URL}/${subjectId}/grades`);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch subjects");
    }
  },

  gradingByScore: async (subjectId, score) => {
    try {
      const response = await api.get(
        `${BASE_URL}/${subjectId}/grades/byScore/${score}`,
      );
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to fetch subjects");
    }
  },

  insertSubj: async (data) => {
    try {
      const response = await api.post(BASE_URL, data);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to create subject");
    }
  },

  insertSubjGrade: async (data) => {
    try {
      const response = await api.post(`${BASE_URL}/grades`, data);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to create subject grade");
    }
  },

  putSubj: async (subjectId, data) => {
    try {
      const response = await api.put(`${BASE_URL}/${subjectId}`, data);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to update subject");
    }
  },

  putSubjectGrade: async (gradeId, data) => {
    try {
      const response = await api.put(`${BASE_URL}/grades/${gradeId}`, data);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to update subject");
    }
  },

  removeSubj: async (subjectId) => {
    try {
      const response = await api.delete(`${BASE_URL}/${subjectId}`);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to delete subject");
    }
  },

  removeSubjGrade: async (gradeId) => {
    try {
      const response = await api.delete(`${BASE_URL}/grades/${gradeId}`);
      return response.data;
    } catch (error) {
      handleServiceError(error, "Failed to delete subject");
    }
  },
};
