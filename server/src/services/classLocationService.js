const ClassLocation = require("../models/classLocationModel");

const getClassLocation = async () => {
  try {
    const result = await ClassLocation.getCLassLocation();
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to get student exam series");
  }
};

module.exports = {
  getClassLocation,
};
