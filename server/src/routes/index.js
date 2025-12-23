const express = require("express");
const authRoute = require("./authRoutes");
const profileRoute = require("./profileRoutes");
const studentRoute = require("./studentRoute");
const examSeriesRoute = require("./examSeriesRoute");
const userRoute = require("./userRoutes");
const examGradeRoute = require("./examGradeRoutes");
const subjectRoute = require("./subjectRoutes");

const Router = express.Router();

// Auth Route
Router.use("/auth", authRoute);
Router.use("/examseries", examSeriesRoute);
Router.use("/student", studentRoute);
Router.use("/profile", profileRoute);
Router.use("/users", userRoute);
Router.use("/examgrades", examGradeRoute);
Router.use("/subjects", subjectRoute);

module.exports = Router;
