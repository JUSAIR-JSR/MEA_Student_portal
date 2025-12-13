"use client";
import { useEffect, useState } from "react";
import API from "@/app/api/axios";

export default function PageGuard({ children }) {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function check() {
      try {
        const res = await API.get("/auth/me");
        if (mounted && res.data.role === "student") {
          setAllowed(true);
        }
      } catch {
        // ❌ DO NOTHING HERE
        // middleware will handle redirect
      } finally {
        if (mounted) setLoading(false);
      }
    }

    check();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <p className="text-center p-10 text-gray-500">
        Checking authentication...
      </p>
    );
  }

  return allowed ? children : null;
}
