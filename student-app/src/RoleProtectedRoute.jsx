import { Navigate } from "react-router-dom";

export default function RoleProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/" replace />;

  if (role !== userRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
