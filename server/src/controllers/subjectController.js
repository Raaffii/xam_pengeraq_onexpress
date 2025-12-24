const getSubjects = async (req, res) => {
  console.log("getSubjects called");
  res.status(200).json({ message: "Placeholder for getSubjects" });
};

module.exports = {
  getSubjects,
};
