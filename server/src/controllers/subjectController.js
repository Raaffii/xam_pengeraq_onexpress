const subjService = require("../services/subjService");

const getSubjects = async (req, res) => {
  try {
    const { page, pageSize, bySeries, searchTerm } = req.query;
    const filterOptions = {
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      series: bySeries,
      searchTerm,
    };
    const result = await subjService.getAllSubjs(filterOptions);

    const response = {
      data: result.examSubj,
    };

    if (page && pageSize) {
      response.pagination = {
        currentPage: result.page,
        pageSize: result.pageSize,
        totalItems: result.total,
        totalPages: Math.ceil(result.total / result.pageSize),
      };
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Fetch examSubj error:", error.message);
    res.status(500).json({
      message: "Failed to fetch exam subject",
      error: error.message,
    });
  }
};

const postSubj = async (req, res) => {
  try {
    const { userId } = req.user;
    const subjectData = {
      ...req.body,
      enteredBy: userId,
    };

    const newSubject = await subjService.newSubj(subjectData);
    res
      .status(201)
      .json({ data: newSubject, message: "Subject created successfully" });
  } catch (error) {
    console.error("Create subject error:", error.message);
    if (
      error.message.includes("duplicate") ||
      error.message.includes("already exists")
    ) {
      return res.status(409).json({
        message: "Subject code already exists",
      });
    }
    if (error.message.includes("not found")) {
      return res.status(404).json({
        message: error.message,
      });
    }
    res.status(500).json({
      message: "Failed to create subject",
      error: error.message,
    });
  }
};

const putSubj = async (req, res) => {
  try {
    const { subjId } = req.params;

    const subjData = {
      ...req.body,
      subjId,
      editedBy: req.user.userId,
    };

    const updatedSubj = await subjService.updateSubj(subjData);
    res.status(200).json(updatedSubj);
  } catch (error) {
    console.error("Update subject error:", error.message);
    if (
      error.message.includes("duplicate") ||
      error.message.includes("already exists")
    ) {
      return res.status(409).json({
        message: "Subject code already exists",
      });
    }
    if (error.message.includes("not found")) {
      return res.status(404).json({
        message: error.message,
      });
    }
    res.status(500).json({
      message: "Failed to update subject",
      error: error.message,
    });
  }
};

const deleteSubj = async (req, res) => {
  try {
    const { subjId } = req.params;

    const subjData = {
      subjToDelete: subjId,
      editedBy: req.user.userId,
    };

    await subjService.deleteSubj(subjData);
    res.status(200).json({ message: "Subject successfully deleted" });
  } catch (error) {
    console.error("Delete subject error:", error.message);
    if (error.message === "Subject not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("Cannot delete or update a parent row")) {
      return res.status(409).json({
        message:
          "Cannot delete selected subject, please delete the related data first!",
      });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getSubjectsByExamSeriesId = async (req, res) => {
  try {
    const examSeriesId = req.params.examSeriesId;

    const result = await subjService.getSubByExamSeries(examSeriesId);

    const response = {
      data: result.examSubj,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Fetch examSubj error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getSubjects,
  postSubj,
  putSubj,
  deleteSubj,
  getSubjectsByExamSeriesId,
};
