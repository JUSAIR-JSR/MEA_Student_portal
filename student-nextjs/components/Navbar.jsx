"use client";
import { logout } from "@/app/api/axios";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import API from "@/app/api/axios";
import {
  Home,
  User,
  Bell,
  FileText,
  LogOut,
  Menu,
  X,
  GraduationCap,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const hideNavbar = pathname === "/login";

  useEffect(() => {
    API.get("/auth/me")
      .then((res) => {
        // 🔥 FIXED: Use res.data.user
        setProfile(res.data.user);
      })
      .catch(() => {});

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (hideNavbar) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-lg border-b border-slate-200"
            : "bg-[linear-gradient(to_bottom_right,#f8fafc,#ffffff)]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => router.push("/dashboard")}
            >
              <div className="w-10 h-10 bg-[linear-gradient(to_bottom_right,#2563eb,#4f46e5)] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Student Portal</h1>
                <p className="text-xs text-slate-500">Academic Dashboard</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              <NavButton
                icon={<Home className="w-4 h-4" />}
                label="Dashboard"
                onClick={() => router.push("/dashboard")}
                active={pathname === "/dashboard"}
              />
              <NavButton
                icon={<FileText className="w-4 h-4" />}
                label="Results"
                onClick={() => router.push("/results")}
                active={pathname === "/results"}
              />
              <NavButton
                icon={<Bell className="w-4 h-4" />}
                label="Notifications"
                onClick={() => router.push("/notifications")}
                active={pathname === "/notifications"}
              />
              <NavButton
                icon={<User className="w-4 h-4" />}
                label="Profile"
                onClick={() => router.push("/profile")}
                active={pathname === "/profile"}
              />

              {/* FIXED: profile?.rollNo */}
              {profile?.rollNo && (
                <div className="ml-4 px-4 py-2 bg-[linear-gradient(to_bottom_right,#eff6ff,#eef2ff)] text-blue-700 rounded-lg font-semibold border border-blue-200 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{profile.rollNo}</span>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="ml-4 flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
              >
                <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                <span className="font-medium">Logout</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 animate-slideDown">
            <div className="px-4 py-3 space-y-1">
              <MobileNavItem
                icon={<Home className="w-5 h-5" />}
                label="Dashboard"
                onClick={() => router.push("/dashboard")}
                active={pathname === "/dashboard"}
              />
              <MobileNavItem
                icon={<FileText className="w-5 h-5" />}
                label="Results"
                onClick={() => router.push("/results")}
                active={pathname === "/results"}
              />
              <MobileNavItem
                icon={<Bell className="w-5 h-5" />}
                label="Notifications"
                onClick={() => router.push("/notifications")}
                active={pathname === "/notifications"}
              />
              <MobileNavItem
                icon={<User className="w-5 h-5" />}
                label="Profile"
                onClick={() => router.push("/profile")}
                active={pathname === "/profile"}
              />

              {profile?.rollNo && (
                <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-700">{profile.name}</p>
                      <p className="text-sm text-slate-500">Roll: {profile.rollNo}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className="h-16"></div>

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

function NavButton({ icon, label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        active
          ? "bg-blue-50 text-blue-600 font-medium border border-blue-200"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function MobileNavItem({ icon, label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active
          ? "bg-blue-50 text-blue-600 font-medium border border-blue-200"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      <div className={`${active ? "text-blue-600" : "text-slate-400"}`}>{icon}</div>
      <span className="font-medium">{label}</span>
    </button>
  );
}
