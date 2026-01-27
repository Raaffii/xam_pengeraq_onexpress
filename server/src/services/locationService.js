const Location = require("../models/locationModel");

const getLocation = async (options = {}) => {
  return await Location.getLocation(options);
};

const postLocation = async (data) => {
  try {
    const result = await Location.postLocation(data);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to get student exam series");
  }
};

const putLocation = async (data, id) => {
  try {
    const result = await Location.putLocation(data, id);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to get student exam series");
  }
};

const getLocationById = async (id) => {
  try {
    const result = await Location.getLocationById(id);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Failed to get student exam series");
  }
};

const deleteLocation = async (id) => {
  try {
    const result = await Location.deleteLocation(id);
    return result;
  } catch (error) {
    console.error("Service error:", error);
    throw error;
  }
};

module.exports = {
  getLocation,
  postLocation,
  putLocation,
  getLocationById,
  deleteLocation,
};
