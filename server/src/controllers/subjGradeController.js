const subjGradeService = require("../services/subjGradeService");

const subjGradeController = {
  async getSubjectGrades(req, res) {
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
  },

  async updateGrade(req, res) {
    try {
      const { subjId } = req.params;
      const gradeData = req.body;

      if (!gradeData.gradeId) {
        return res
          .status(400)
          .json({ message: "Grade ID is required in request body" });
      }

      const updatedGrade = await subjGradeService.updateGrade(
        subjId,
        gradeData.gradeId,
        gradeData,
      );

      res.status(200).json({
        data: updatedGrade,
        message: "Grade updated successfully",
      });
    } catch (error) {
      console.error("Update grade error:", error.message);

      if (error.message === "Subject not found") {
        return res.status(404).json({ message: error.message });
      }

      if (error.message === "Grade not found") {
        return res.status(404).json({ message: error.message });
      }

      if (error.message === "Subject mismatch") {
        return res
          .status(400)
          .json({ message: "Grade does not belong to this subject" });
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
  },

  async deleteGrade(req, res) {
    try {
      const { subjId } = req.params;
      const { gradeId } = req.body;

      if (!gradeId) {
        return res
          .status(400)
          .json({ message: "Grade ID is required in request body" });
      }

      await subjGradeService.deleteGrade(subjId, gradeId);

      res.status(200).json({
        message: "Grade deleted successfully",
      });
    } catch (error) {
      console.error("Delete grade error:", error.message);

      if (error.message === "Subject not found") {
        return res.status(404).json({ message: error.message });
      }

      if (error.message === "Grade not found") {
        return res.status(404).json({ message: error.message });
      }

      if (error.message === "Subject mismatch") {
        return res
          .status(400)
          .json({ message: "Grade does not belong to this subject" });
      }

      if (error.message.includes("Cannot delete the last grade")) {
        return res.status(400).json({ message: error.message });
      }

      res.status(500).json({
        message: "Failed to delete grade",
        error: error.message,
      });
    }
  },

  async getGradeForScore(req, res) {
    try {
      const { subjId, score } = req.params;

      const result = await subjGradeService.getGradeForScore(
        subjId,
        parseFloat(score),
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

      if (error.message.includes("Score must be")) {
        return res.status(400).json({ message: error.message });
      }

      res.status(500).json({
        message: "Failed to get grade for score",
        error: error.message,
      });
    }
  },

  async checkDuplicateGrades(req, res) {
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
  },

  async cleanDuplicateGrades(req, res) {
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
  },

  async checkSubjectsWithoutGrades(req, res) {
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
  },
};

module.exports = subjGradeController;
