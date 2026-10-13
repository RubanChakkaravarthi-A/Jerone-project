import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useDemo } from "../context/DemoContext";
import { AppShell } from "../components/layout/AppShell";
import { LoginPage } from "../features/auth/LoginPage";
import {
  StudentDashboardPage,
  StudentProfilePage
} from "../features/student/StudentDashboardAndProfile";
import {
  StudentCoursesPage,
  StudentAttendancePage,
  StudentResultsPage,
  StudentAnnouncementsPage,
  StudentTimetablePage
} from "../features/student/StudentAcademicPages";
import {
  StudentFeesPage,
  StudentApplicationsPage
} from "../features/student/StudentServicesPages";
import {
  AdminDashboardPage,
  AdminStudentsPage,
  AdminStudentDetailPage
} from "../features/admin/AdminDashboardAndStudents";
import {
  AdminCoursesPage,
  AdminAttendancePage,
  AdminResultsPage
} from "../features/admin/AdminAcademicPages";
import {
  AdminAnnouncementsPage,
  AdminApplicationsPage,
  AdminSettingsPage
} from "../features/admin/AdminServicesPages";

const Protected = ({ role }: { role: "student" | "admin" }) => {
  const { session } = useDemo();
  console.log(`Protected guard for ${role}: session is`, session);
  if (!session) return <Navigate to="/login" replace />;
  if (session.role !== role) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const NotFoundPage = () => (
  <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
    <h1>404</h1>
    <p>The page you are looking for does not exist in the local demo.</p>
    <a href="/login">Return to login</a>
  </div>
);

export const App = () => {
  const { session } = useDemo();
  console.log("App rendering: session is", session);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<Protected role="student" />}>
        <Route element={<AppShell role="student"><Outlet /></AppShell>}>
          <Route path="/student/dashboard" element={<StudentDashboardPage />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
          <Route path="/student/courses" element={<StudentCoursesPage />} />
          <Route path="/student/attendance" element={<StudentAttendancePage />} />
          <Route path="/student/results" element={<StudentResultsPage />} />
          <Route path="/student/announcements" element={<StudentAnnouncementsPage />} />
          <Route path="/student/timetable" element={<StudentTimetablePage />} />
          <Route path="/student/fees" element={<StudentFeesPage />} />
          <Route path="/student/applications" element={<StudentApplicationsPage />} />
        </Route>
      </Route>

      <Route element={<Protected role="admin" />}>
        <Route element={<AppShell role="admin"><Outlet /></AppShell>}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/students" element={<AdminStudentsPage />} />
          <Route path="/admin/students/:studentId" element={<AdminStudentDetailPage />} />
          <Route path="/admin/courses" element={<AdminCoursesPage />} />
          <Route path="/admin/attendance" element={<AdminAttendancePage />} />
          <Route path="/admin/results" element={<AdminResultsPage />} />
          <Route path="/admin/announcements" element={<AdminAnnouncementsPage />} />
          <Route path="/admin/applications" element={<AdminApplicationsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
