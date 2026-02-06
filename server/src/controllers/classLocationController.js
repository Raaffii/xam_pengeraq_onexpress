const classLocationService = require("../services/classLocationService");

const getClassLocation = async (req, res) => {
  try {
    const result = await classLocationService.getClassLocation();
    res.status(200).json({
      data: result.data,
    });
  } catch (error) {
    console.error("Get class location error:", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getClassLocation,
};
