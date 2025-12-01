import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ExamDetails from "./pages/ExamDetails";
import TeacherProtectedRoute from "./TeacherProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <TeacherProtectedRoute>
              <Dashboard />
            </TeacherProtectedRoute>
          }
        />

        <Route
          path="/exam/:examId"
          element={
            <TeacherProtectedRoute>
              <ExamDetails />
            </TeacherProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
