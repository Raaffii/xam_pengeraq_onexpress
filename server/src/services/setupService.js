const Setup = require("../models/setupModel");

const SetupService = {
  async getSetup(options) {
    return await Setup.getSetup(options);
  },

  async getSetupById(setupId) {
    const result = await Setup.getSetupById(setupId);

    if (!result) {
      throw new Error("Setup not found");
    }

    return result;
  },

  async postSetup(data) {
    try {
      const result = await Setup.postSetup(data);
      return result;
    } catch (error) {
      console.error("Service error:", error);
      throw error;
    }
  },

  async putSetup(id, data) {
    try {
      const result = await Setup.putSetup(id, data);

      if (!result) {
        throw new Error("Setup not found");
      }

      return result;
    } catch (error) {
      console.error("Service error:", error);
      throw error;
    }
  },

  async deleteSetup(id) {
    try {
      const result = await Setup.deleteSetup(id);
      return result;
    } catch (error) {
      console.error("Service error:", error);
      throw error;
    }
  },
};

module.exports = SetupService;
