"use client";
import { useEffect, useState } from "react";
import API from "@/app/api/axios";
import { useRouter } from "next/navigation";

export default function PageGuard({ children }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await API.get("/auth/me");
      if (res.data.role === "student") {
        setAllowed(true);
      } else {
        router.replace("/login");
      }
    } catch {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // 🔴 CRITICAL: handles BACK button cache restore
    const handlePageShow = (e) => {
      if (e.persisted) {
        setAllowed(false);
        setLoading(true);
        checkAuth();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
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
