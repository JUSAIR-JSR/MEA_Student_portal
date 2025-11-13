import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import StudentResults from "./pages/StudentResults";
import Navbar from "./components/Navbar";
import StudentProfile from "./pages/StudentProfile";
import RoleProtectedRoute from "./RoleProtectedRoute";



export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

function Layout() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Student Pages */}
        <Route
          path="/student-dashboard"
          element={
            <RoleProtectedRoute role="student">
              <StudentDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/student-results"
          element={
            <RoleProtectedRoute role="student">
              <StudentResults />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/student-profile"
          element={
            <RoleProtectedRoute role="student">
              <StudentProfile />
            </RoleProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}


