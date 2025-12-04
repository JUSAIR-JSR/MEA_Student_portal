"use client";

import { useState, useEffect, useRef } from "react";
import { logout } from "@/app/api/axios";
import { useRouter } from "next/navigation";
import { Monitor, LogOut, GraduationCap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const router = useRouter();
  const [hoveredButton, setHoveredButton] = useState(null);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const logoutTimeoutRef = useRef(null);

  const handleLogout = async () => {
    if (!logoutConfirm) {
      setLogoutConfirm(true);
      logoutTimeoutRef.current = setTimeout(() => {
        setLogoutConfirm(false);
      }, 3000);
      return;
    }

    await logout();
    router.push("/");
  };

  useEffect(() => {
    return () => {
      if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="
        fixed top-0 left-0 right-0 z-50
        px-4 md:px-8 py-4
        bg-black/90
        backdrop-blur-xl
        border-b border-white/10
        shadow-sm
      "
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between text-white">

        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            {/* Rotating Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-blue-400/40 rounded-full"
            />

            {/* Logo Icon */}
            <div
              className="
                relative p-3 rounded-full
                bg-linear-to-br from-blue-600 to-indigo-700
                shadow-lg shadow-blue-500/30
                group-hover:shadow-xl group-hover:shadow-blue-500/50
                transition-all duration-300
              "
            >
              <GraduationCap className="w-6 h-6 text-white" />

              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col">
            <h1
              className="
                text-lg md:text-xl font-semibold
                bg-linear-to-r from-blue-400 to-indigo-300
                bg-clip-text text-transparent
              "
            >
              Teacher Dashboard
            </h1>
            <p className="text-xs text-gray-400">Premium Edition</p>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-5">

          {/* Dashboard Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/dashboard")}
            className="
              hidden md:flex items-center gap-2
              px-4 py-2.5 rounded-full
              bg-linear-to-r from-blue-600 to-indigo-600
              hover:from-blue-700 hover:to-indigo-700
              shadow-lg shadow-blue-500/30
              hover:shadow-xl hover:shadow-blue-500/50
              transition-all duration-300
            "
          >
            <Monitor className="w-5 h-5 text-white" />
            <span className="font-medium text-white">Dashboard</span>
          </motion.button>

          {/* Mobile Dashboard Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/dashboard")}
            className="
              md:hidden p-2 rounded-full
              bg-linear-to-r from-blue-600 to-indigo-600
              shadow-lg shadow-blue-500/30
            "
          >
            <Monitor className="w-5 h-5 text-white" />
          </motion.button>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: logoutConfirm ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className={`
              relative flex items-center gap-2
              px-4 py-2.5 rounded-full
              ${
                logoutConfirm
                  ? "bg-linear-to-r from-red-500 to-rose-600"
                  : "bg-linear-to-r from-gray-800 to-gray-900"
              }
              text-white shadow-lg shadow-white/10
              hover:shadow-xl hover:shadow-red-500/30
              transition-all duration-300
            `}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium hidden md:inline">
              {logoutConfirm ? "Click again" : "Logout"}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Bottom Gradient Border */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div
          className="
            h-full w-full 
            bg-linear-to-r from-transparent via-blue-500/40 to-transparent
          "
        />
      </motion.div>
    </motion.nav>
  );
}
