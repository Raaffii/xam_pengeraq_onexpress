import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { NotFoundPage } from "../components/ErrorPage";
import { PublicRoute } from "@/components/layout/PublicRoute";
import LoginPage from "@/pages/LoginPage";
import Layout from "@/components/layout/Layout";
import DashboardPage from "@/pages/DashboardPage";
import ProfilePage from "@/pages/ProfilePage";
import StudentsPage from "@/pages/StudentsPage";
import StudentsDetailPage from "@/components/student/StudentsDetailPage";
import ExamsPage from "@/pages/ExamsPage";
import ExamsSeriesPage from "@/pages/ExamsSeriesPage";
import UsersPage from "@/pages/UsersPage";
import ExamSeriesDetailPage from "@/components/examseries/ExamSeriesDetailPage";
import ExamDetailPage from "@/components/exam/ExamDetailPage";
import ExamSubjectPage from "@/pages/ExamSubjectPage";
import SchedulesPages from "@/pages/SchedulePage";
import { ExamSubjectGradePage } from "@/components/subjects";

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
    { path: "profile", element: <ProfilePage /> },
    { path: "exams", element: <ExamsPage /> },
    { path: "exams/:id", element: <ExamDetailPage /> },
    { path: "series", element: <ExamsSeriesPage /> },
    { path: "series/:id", element: <ExamSeriesDetailPage /> },
    { path: "subjects", element: <ExamSubjectPage /> },
    { path: "subjects/:subjectId", element: <ExamSubjectGradePage /> },
    { path: "students", element: <StudentsPage /> },
    { path: "students/:id", element: <StudentsDetailPage /> },
    { path: "users", element: <UsersPage /> },
    { path: "schedule", element: <SchedulesPages /> },
  ],
};

const publicRoutes = [
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
];

export const routes = [
  ...publicRoutes,
  privateRoutes,
  { path: "*", element: <NotFoundPage /> },
];
