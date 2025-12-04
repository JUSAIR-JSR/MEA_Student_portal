"use client";
import { useEffect, useState } from "react";
import API from "@/app/api/axios";
import { useRouter } from "next/navigation";

export default function PageGuard({ children }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      try {
        const res = await API.get("/auth/me");
        if (res.data.role === "student") setAllowed(true);
        else router.push("/login");
      } catch {
        router.push("/login");
      }
      setLoading(false);
    }
    check();
  }, []);

  if (loading)
    return (
      <p className="text-center p-10 text-gray-500">Checking authentication...</p>
    );

  return allowed ? children : null;
}
