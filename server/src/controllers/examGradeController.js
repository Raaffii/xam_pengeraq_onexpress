const getExamGrades = async (req, res) => {
  console.log("getExamGrades called");
  res.status(200).json({ message: "Placeholder for getExamGrades" });
};

module.exports = {
  getExamGrades,
};
