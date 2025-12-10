import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMe } from "./api/api";

export default function AdminProtectedRoute({ children }) {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((res) => {
        if (res.data.role === "admin") setAllowed(true);
      })
      .catch(() => setAllowed(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!allowed) return <Navigate to="/" replace />;

  return children;
}
