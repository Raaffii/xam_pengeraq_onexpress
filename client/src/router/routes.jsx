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
import CalendarPage from "@/pages/CalendarPage";
import ScheduleDetailPage from "@/components/schedule/ScheduleDetailPage";
import { ExamSubjectGradePage } from "@/components/subjects";
import { publicRoutes } from "./publicRoutes";
import TranscriptsPage from "@/pages/TranscriptsPage";
import { NotFoundPage, ProtectedRoute } from "@/components/layout";

const privateRoutes = {
  path: "/",
  element: (
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <DashboardPage /> },
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
    { path: "schedule", element: <SchedulesPages /> },
    { path: "schedule/:id", element: <ScheduleDetailPage /> },
    { path: "schedule/calendar", element: <CalendarPage /> },
    { path: "transcripts", element: <TranscriptsPage /> },
  ],
};

export const routes = [
  ...publicRoutes,
  privateRoutes,
  { path: "*", element: <NotFoundPage /> },
];
