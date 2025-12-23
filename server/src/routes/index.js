const express = require("express");
const authRoute = require("./authRoutes");
const profileRoute = require("./profileRoutes");
const studentRoute = require("./studentRoute");
const examSeriesRoute = require("./examSeriesRoute");

const Router = express.Router();

// Auth Route
Router.use("/auth", authRoute);
Router.use("/examseries", examSeriesRoute);
Router.use("/student", studentRoute);
Router.use("/profile", profileRoute);

module.exports = Router;
