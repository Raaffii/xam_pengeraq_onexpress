const studentClassService = require("../services/studentClassService");

const getStudentClass = async (req, res) => {
  try {
    let { page, limit, search, schedule } = req.query;

    const result = await studentClassService.getStudentClass(
      page,
      limit,
      search,
      schedule,
    );
    res.status(200).json({
      data: result.data,
      pagination: {
        currentPage: Number(page),
        pageSize: Number(limit),
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

const assignStudentClass = async (req, res) => {
  try {
    const data = await studentClassService.putStudentClass(req.body);
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

module.exports = {
  getStudentClass,
  assignStudentClass,
};
