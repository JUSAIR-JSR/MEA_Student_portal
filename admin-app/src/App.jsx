import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TeacherManager from "./pages/TeacherManager";
import StudentManager from "./pages/StudentManager";
import AllResults from "./pages/AllResults";
import AdminNotifications from "./pages/AdminNotifications";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminProtectedRoute from "./AdminProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <AdminProtectedRoute>
              <Dashboard />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/teachers"
          element={
            <AdminProtectedRoute>
              <TeacherManager />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/students"
          element={
            <AdminProtectedRoute>
              <StudentManager />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/all-results"
          element={
            <AdminProtectedRoute>
              <AllResults />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <AdminProtectedRoute>
              <AdminNotifications />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <AdminProtectedRoute>
              <AdminAnalytics />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
