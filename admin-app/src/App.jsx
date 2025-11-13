import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TeacherManager from "./pages/TeacherManager";
import StudentManager from "./pages/StudentManager";
import AllResults from "./pages/AllResults"; 
import AdminNotifications from "./pages/AdminNotifications";
import AdminAnalytics from "./pages/AdminAnalytics"; // ⭐ Add this

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teachers" element={<TeacherManager />} />
        <Route path="/students" element={<StudentManager />} />
        <Route path="/all-results" element={<AllResults />} />
        <Route path="/notifications" element={<AdminNotifications />} />
        <Route path="/analytics" element={<AdminAnalytics />} /> {/* ⭐ NEW */}
      </Routes>
    </BrowserRouter>
  );
}
