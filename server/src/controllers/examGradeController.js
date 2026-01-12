const finalGradeService = require("../services/finalGradeService");

const getFinalGrades = async (req, res) => {
  try {
    const { page, pageSize, byId, bySeries, searchTerm, isActive } = req.query;
    const options = {
      page: page ? parseInt(page) : undefined,
      pageSize: pageSize ? parseInt(pageSize) : undefined,
      byId,
      bySeries,
      searchTerm,
      isActive: isActive === undefined ? true : isActive,
    };
    const result = await finalGradeService.getAllGrades(options);

    const response = {
      data: result.users,
    };

    if (page && pageSize) {
      response.pagination = {
        currentPage: page,
        pageSize: pageSize,
        totalItems: result.total,
        totalPages: Math.ceil(result.total / pageSize),
      };
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("getFinalGrades error:", error);
    res.status(500).json({
      message: "Failed to get final grades",
      error: error.message,
    });
  }
};

const getFinalGradeById = async (req, res) => {
  try {
    const { gradeId } = req.params;
    const grade = await finalGradeService.findById(gradeId);
    if (!grade) {
      return res.status(404).json({
        message: "Final grade not found",
      });
    }
    res.status(200).json(grade);
  } catch (error) {
    console.error("getFinalGradeById error:", error);
    res.status(500).json({
      message: "Failed to get final grade",
      error: error.message,
    });
  }
};

const postFinalGrade = async (req, res) => {
  try {
    const { userId } = req.user;
    const formData = {
      ...req.body,
      enteredBy: userId,
    };
    const grade = await finalGradeService.newGrade(formData);
    res.status(201).json(grade);
  } catch (error) {
    console.error("createFinalGrade error:", error);
    if (error.message.includes("Exam series not found")) {
      return res.status(400).json({
        message: error.message,
      });
    }
    res.status(500).json({
      message: "Failed to create final grade",
      error: error.message,
    });
  }
};

const putFinalGrade = async (req, res) => {
  try {
    const { gradeId } = req.params;

    const formData = {
      ...req.body,
      gradeId,
      editedBy: req.user.userId,
    };
    const grade = await finalGradeService.updateFGrade(formData);
    res.status(200).json(grade);
  } catch (error) {
    console.error("updateFinalGrade error:", error);
    if (error.message.includes("Exam series not found")) {
      return res.status(400).json({
        message: error.message,
      });
    }
    if (error.message.includes("Grade not found")) {
      return res.status(404).json({
        message: error.message,
      });
    }
    res.status(500).json({
      message: "Failed to update final grade",
      error: error.message,
    });
  }
};

const deleteFinalGrade = async (req, res) => {
  try {
    const { gradeId } = req.params;

    const formData = {
      gradeToDelete: gradeId,
      editedBy: req.user.userId,
    };

    await finalGradeService.deleteFGrade(formData);
    res.status(200).json({
      message: "Final grade deleted successfully",
    });
  } catch (error) {
    console.error("deleteFinalGrade error:", error);
    if (error.message.includes("Grade not found")) {
      return res.status(404).json({
        message: error.message,
      });
    }
    res.status(500).json({
      message: "Failed to delete final grade",
      error: error.message,
    });
  }
};

module.exports = {
  getFinalGrades,
  getFinalGradeById,
  postFinalGrade,
  putFinalGrade,
  deleteFinalGrade,
};
