const classScheduleService = require("../services/examScheduleService");

const getClassSchedule = async (req, res) => {
  try {
    let { page, limit, searchTerm, date } = req.query;

    const { teacherId } = req.user;

    const result = await classScheduleService.getClassSchedule(
      page,
      limit,
      searchTerm,
      date,
      teacherId
    );

    res.status(200).json({
      data: result.data,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalPages: Math.ceil(result.total / limit),
        totalItems: result.total,
      },
    });
  } catch (error) {
    console.error("get student error:", error);

    res.status(500).json({
      success: false,
      message: "get student failed",
      error: error.message,
    });
  }
};

const postClassSchedule = async (req, res) => {
  try {
    const { userId } = req.user;
    const data = await classScheduleService.postClassSchedule(req.body, userId);

    res.status(200).json(data);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        error: true,
        message: "Duplicate entry",
      });
    }
    res.status(500).json({
      success: false,
      message: "add student failed",
      error: error.message,
    });
  }
};

const getClassScheduleById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await classScheduleService.getScheduleById(id);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.error("get student error:", error);

    res.status(500).json({
      success: false,
      message: "get student failed",
      error: error.message,
    });
  }
};

const putClassSchedule = async (req, res) => {
  try {
    const { userId } = req.user;

    const data = await classScheduleService.putClassSchedule(
      req.params.id,
      req.body,
      userId
    );
    res.status(200).json(data);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        error: true,
        message: "Duplicate entry",
      });
    }
    res.status(500).json({
      success: false,
      message: "edit student failed",
      error: error.message,
    });
  }
};

const deleteClassSchedule = async (req, res) => {
  try {
    const data = await classScheduleService.deleteClassSchedule(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        error: true,
        message: "Duplicate entry",
      });
    }
    res.status(500).json({
      success: false,
      message: "delete student failed",
      error: error.message,
    });
  }
};
module.exports = {
  getClassSchedule,
  postClassSchedule,
  putClassSchedule,
  deleteClassSchedule,
  getClassScheduleById,
};
