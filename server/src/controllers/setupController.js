const setupService = require("../services/setupService");

const getSetup = async (req, res) => {
  try {
    let { page, pageSize, searchTerm } = req.query;

    const result = await setupService.getSetup({ page, pageSize, searchTerm });
    res.status(200).json({
      data: result.data,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalPages: Math.ceil(result.total / pageSize),
        totalItems: result.total,
      },
    });
  } catch (error) {
    console.error("get setup error:", error);

    res.status(500).json({
      message: "Failed to fetch setups",
      error: error.message,
    });
  }
};

const getSetupById = async (req, res) => {
  try {
    const id = req.params.setupId;

    const result = await setupService.getSetupById(id);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.error("get setup error:", error);

    res.status(500).json({
      message: "Failed to fetch setup",
      error: error.message,
    });
  }
};

const postSetup = async (req, res) => {
  try {
    const data = await setupService.postSetup({
      ...req.body,
      enteredBy: req.user.userId,
    });

    res.status(200).json(data);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Duplicate entry",
      });
    }
    res.status(500).json({
      message: "Failed to create setup",
      error: error.message,
    });
  }
};

const putSetup = async (req, res) => {
  try {
    const data = await setupService.putSetup(req.params.setupId, {
      ...req.body,
      editedBy: req.user.userId,
    });
    res.status(200).json(data);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Duplicate entry",
      });
    }
    if (error.message.includes("not found")) {
      return res.status(404).json({
        message: error.message,
      });
    }
    res.status(500).json({
      message: "Failed to update setup",
      error: error.message,
    });
  }
};

const deleteSetup = async (req, res) => {
  try {
    const data = await setupService.deleteSetup(req.params.setupId);
    res.status(200).json(data);
  } catch (error) {
    if (error.message.includes("not found")) {
      return res.status(404).json({
        message: error.message,
      });
    }
    res.status(500).json({
      message: "get setup failed",
      error: error.message,
    });
  }
};
module.exports = {
  getSetup,
  postSetup,
  putSetup,
  deleteSetup,
  getSetupById,
};
