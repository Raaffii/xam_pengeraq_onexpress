const subjGradeService = require("../services/subjGradeService");

const getSubjectGrades = async (req, res) => {
  try {
    const { subjId } = req.params;
    const { seriesId } = req.query;

    const result = await subjGradeService.getSubjectGrades(
      subjId,
      seriesId ? parseInt(seriesId) : null,
    );

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.error("Fetch subject grades error:", error.message);

    if (error.message === "Subject not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({
      message: "Failed to fetch subject grades",
      error: error.message,
    });
  }
};

const newGrade = async (req, res) => {
  try {
    const gradeData = req.body;

    const newGrade = await subjGradeService.newGrade(gradeData);

    res.status(200).json({
      data: newGrade,
      message: "Grade added successfully",
    });
  } catch (error) {
    console.error("Add grade error:", error.message);

    if (error.message === "Grade not found") {
      return res.status(404).json({ message: error.message });
    }

    if (
      error.message.includes("overlap") ||
      error.message.includes("Minimum score")
    ) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({
      message: "Failed to add grade",
      error: error.message,
    });
  }
};

const updateGrade = async (req, res) => {
  try {
    const { gradeId } = req.params;
    const gradeData = { ...req.body, editedBy: req.user.userId };

    const updatedGrade = await subjGradeService.updateGrade(gradeId, gradeData);

    res.status(200).json({
      data: updatedGrade,
      message: "Grade updated successfully",
    });
  } catch (error) {
    console.error("Update grade error:", error.message);

    if (error.message === "Grade not found") {
      return res.status(404).json({ message: error.message });
    }

    if (
      error.message.includes("overlap") ||
      error.message.includes("Minimum score")
    ) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({
      message: "Failed to update grade",
      error: error.message,
    });
  }
};

const deleteGrade = async (req, res) => {
  try {
    const { gradeId } = req.params;
    await subjGradeService.deleteGrade(gradeId);

    res.status(200).json({
      message: "Grade deleted successfully",
    });
  } catch (error) {
    console.error("Delete grade error:", error.message);
    if (error.message === "Grade not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({
      message: "Failed to delete grade",
      error: error.message,
    });
  }
};

const getGradeForScore = async (req, res) => {
  try {
    const { subjId, score } = req.params;
    const { isRetake } = req.query;

    const result = await subjGradeService.getGradeForScore(
      subjId,
      parseFloat(score),
      isRetake || false,
    );

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.error("Get grade for score error:", error.message);

    if (
      error.message === "Subject not found" ||
      error.message === "No grade found for this score"
    ) {
      return res.status(404).json({ message: error.message });
    }

    if (
      error.message.includes("Score must be") ||
      error.message.includes("Retake score")
    ) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({
      message: "Failed to get grade for score",
      error: error.message,
    });
  }
};

const checkDuplicateGrades = async (req, res) => {
  try {
    const result = await subjGradeService.checkDuplicateGrades();

    if (result.hasDuplicates) {
      return res.status(200).json({
        data: result,
        message: `Found ${result.totalDuplicates} duplicate grade(s) across ${result.affectedSubjects.length} subject(s)`,
      });
    }

    res.status(200).json({
      data: result,
      message: "No duplicate grades found",
    });
  } catch (error) {
    console.error("Check duplicate grades error:", error.message);

    res.status(500).json({
      message: "Failed to check duplicate grades",
      error: error.message,
    });
  }
};

const cleanDuplicateGrades = async (req, res) => {
  try {
    const result = await subjGradeService.cleanDuplicateGrades();

    if (result.deletedCount === 0) {
      return res.status(200).json({
        data: result,
        message: "No duplicate grades found to clean",
      });
    }

    res.status(200).json({
      data: result,
      message: `Successfully cleaned ${result.deletedCount} duplicate grade(s) from ${result.affectedSubjects.length} subject(s)`,
    });
  } catch (error) {
    console.error("Clean duplicate grades error:", error.message);

    res.status(500).json({
      message: "Failed to clean duplicate grades",
      error: error.message,
    });
  }
};

const checkSubjectsWithoutGrades = async (req, res) => {
  try {
    const result = await subjGradeService.checkSubjectsWithoutGrades();

    if (result.count === 0) {
      return res.status(200).json({
        data: result,
        message: "All subjects have grade records",
      });
    }

    res.status(200).json({
      data: result,
      message: `Found ${result.count} subject(s) without any grade records`,
    });
  } catch (error) {
    console.error("Check subjects without grades error:", error.message);

    res.status(500).json({
      message: "Failed to check subjects without grades",
      error: error.message,
    });
  }
};

const insertDefaultGradesForSubjects = async (req, res) => {
  try {
    const result = await subjGradeService.insertDefaultGradesForSubjects();

    if (result.insertedCount === 0) {
      return res.status(200).json({
        data: result,
        message: "No subjects found that need default grades",
      });
    }

    res.status(200).json({
      data: result,
      message: `Successfully inserted default grades for ${result.affectedSubjects.length} subject(s). Total ${result.insertedCount} grade records created.`,
    });
  } catch (error) {
    console.error("Insert default grades error:", error.message);

    res.status(500).json({
      message: "Failed to insert default grades",
      error: error.message,
    });
  }
};

module.exports = {
  getSubjectGrades,
  newGrade,
  updateGrade,
  deleteGrade,
  getGradeForScore,
  checkDuplicateGrades,
  cleanDuplicateGrades,
  checkSubjectsWithoutGrades,
  insertDefaultGradesForSubjects,
};
