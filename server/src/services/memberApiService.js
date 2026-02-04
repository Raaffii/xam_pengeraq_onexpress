require("dotenv").config();
const axios = require("axios");

const API_URL = process.env.MEMBER_API_URL;
const API_KEY = process.env.MEMBER_API_KEY;

const isApiConfigured = Boolean(API_URL && API_KEY);

const apiService = {
  async fetchMember(filter) {
    if (!isApiConfigured) {
      return [];
    }

    try {
      const response = await axios.get(`${API_URL}/api/member-list`, {
        params: filter,
        headers: {
          "X-API-KEY": API_KEY,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Member API error:", error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  async findMemberByEmail(formData) {
    if (!isApiConfigured) {
      return null;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/member-list/check-exist`,
        formData,
        {
          headers: {
            "X-API-KEY": API_KEY,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Member API error:", error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};

module.exports = apiService;
