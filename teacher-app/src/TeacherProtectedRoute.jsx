import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMe } from "./api/api";

export default function TeacherProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const res = await getMe();
        if (res.data.role === "teacher") setAllowed(true);
      } catch (err) {
        setAllowed(false);
      }
      setLoading(false);
    }

    check();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!allowed) return <Navigate to="/" replace />;

  return children;
}
