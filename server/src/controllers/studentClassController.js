const studentClassService = require("../services/studentClassService");

const getStudentClass = async (req, res) => {
  try {
    let { page, pageSize, search, schedule } = req.query;

    const result = await studentClassService.getStudentClass({
      page,
      limit: pageSize,
      search,
      schedule,
    });
    res.status(200).json({
      data: result.data,
      pagination: {
        currentPage: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(result.total / pageSize),
        totalItems: result.total,
      },
    });
  } catch (error) {
    console.error("Error:", error);

    res.status(500).json({
      message: "Internal Server Errror",
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
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getStudentClass,
  assignStudentClass,
};
