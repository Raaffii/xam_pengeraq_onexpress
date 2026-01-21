const express = require("express");
const authRoute = require("./authRoutes");
const profileRoute = require("./profileRoutes");
const studentRoute = require("./studentRoute");
const examSeriesRoute = require("./examSeriesRoute");
const examRoute = require("./examRoute");

const examResultRoute = require("./examResultRoute");

const userRoute = require("./userRoutes");
const examGradeRoute = require("./examGradeRoutes");
const subjectRoute = require("./subjectRoutes");
const subjGradeRoute = require("./subjGradeRoutes");
const studentExamRoute = require("./studentExamRoute");
const classScheduleRoute = require("./classScheduleRoute");
const teacherRoute = require("./teacherRoutes");
const classLocationRoute = require("./classLocationRoutes");
const classScheduleDetailRoute = require("./classScheduleDetailRoute");
const studentClassRoute = require("./studentClassRoute");

const classAttendanceRoute = require("./classAttendance");

const dashboardRoute = require("./dashboardRoutes");
const setupRoute = require("./setupRoute");

const Router = express.Router();

// Auth Route
Router.use("/auth", authRoute);
Router.use("/dashboard", dashboardRoute);
Router.use("/examseries", examSeriesRoute);
Router.use("/student", studentRoute);
Router.use("/profile", profileRoute);
Router.use("/exams", examRoute);
Router.use("/exam-results", examResultRoute);
Router.use("/users", userRoute);
Router.use("/exam-grades", examGradeRoute);
Router.use("/subject", subjectRoute);
Router.use("/subject", subjGradeRoute);
Router.use("/student-exams", studentExamRoute);
Router.use("/classschedule", classScheduleRoute);
Router.use("/teacher", teacherRoute);
Router.use("/classlocation", classLocationRoute);
Router.use("/classscheduledetail", classScheduleDetailRoute);
Router.use("/studentclass", studentClassRoute);
Router.use("/classattendance", classAttendanceRoute);
Router.use("/setups", setupRoute);

module.exports = Router;
