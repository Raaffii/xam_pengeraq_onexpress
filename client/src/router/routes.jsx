import Layout from "@/components/layout/Layout";
import DashboardPage from "@/pages/DashboardPage";
import StudentsPage from "@/pages/StudentsPage";
import StudentsDetailPage from "@/components/student/StudentsDetailPage";
import ExamsPage from "@/pages/ExamsPage";
import ExamsSeriesPage from "@/pages/ExamsSeriesPage";
import UsersPage from "@/pages/UsersPage";
import ExamSeriesDetailPage from "@/components/examseries/ExamSeriesDetailPage";
import ExamDetailPage from "@/components/exam/ExamDetailPage";
import ExamSubjectPage from "@/pages/ExamSubjectPage";
import SchedulesPages from "@/pages/SchedulePage";
import TeacherSchedulesPages from "@/pages/TeacherSchedulePage";
import CalendarPage from "@/pages/CalendarPage";
import ScheduleDetailPage from "@/components/schedule/ScheduleDetailPage";
import { ExamSubjectGradePage } from "@/components/subjects";

import TeacherCalendarPage from "@/pages/TeacherCalendarPage";
import TeacherScheduleDetailPage from "@/components/teacher/teacherScheduleDetailPage";
import ClassAttendancePage from "@/pages/ClassAtendancePage";
import TeacherPage from "@/pages/TeacherPage";
import { publicRoutes } from "./publicRoutes";
import TranscriptsPage from "@/pages/TranscriptsPage";
import { NotFoundPage, ProtectedRoute } from "@/components/layout";

const teacherPrivateRoutes = {
  path: "/teacher",
  element: (
    <ProtectedRoute roles={["teacher"]}>
      <Layout />
    </ProtectedRoute>
  ),
  children: [
    { path: "schedule", element: <TeacherSchedulesPages /> },
    { path: "scheduledetail/:id", element: <TeacherScheduleDetailPage /> },
    { path: "schedule/calendar", element: <TeacherCalendarPage /> },
    { path: "class-attendance/:id", element: <ClassAttendancePage /> },
  ],
};

const adminPrivateRoutes = {
  path: "/",
  element: (
    <ProtectedRoute roles={["admin"]}>
      <Layout />
    </ProtectedRoute>
  ),
  children: [
    { path: "dashboard", element: <DashboardPage /> },
    { path: "exams", element: <ExamsPage /> },
    { path: "exams/:id", element: <ExamDetailPage /> },
    { path: "series", element: <ExamsSeriesPage /> },
    { path: "series/:id", element: <ExamSeriesDetailPage /> },
    { path: "subjects", element: <ExamSubjectPage /> },
    { path: "subjects/:subjectId", element: <ExamSubjectGradePage /> },
    { path: "students", element: <StudentsPage /> },
    { path: "students/:studentId", element: <StudentsDetailPage /> },
    { path: "users", element: <UsersPage /> },
    { path: "teachers", element: <TeacherPage /> },
    { path: "schedule", element: <SchedulesPages /> },
    { path: "schedule/:id", element: <ScheduleDetailPage /> },
    { path: "schedule/calendar", element: <CalendarPage /> },
    { path: "transcripts", element: <TranscriptsPage /> },
  ],
};

const adminAndTeacherRoute = {
  path: "/",
  element: (
    <ProtectedRoute roles={["admin", "teacher"]}>
      <Layout />
    </ProtectedRoute>
  ),
  children: [{ index: true, element: <DashboardPage /> }],
};

export const routes = [
  ...publicRoutes,
  teacherPrivateRoutes,
  adminPrivateRoutes,
  adminAndTeacherRoute,
  { path: "*", element: <NotFoundPage /> },
];
