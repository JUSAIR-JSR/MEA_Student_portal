import { useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";
import { adminLogout } from "../api/api";

// Icons
import {
  FiHome,
  FiUsers,
  FiUserCheck,
  FiBarChart2,
  FiBell,
  FiLogOut,
  FiMenu,
  FiX,
  FiAward,
  FiTrendingUp,
} from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await adminLogout(); 
    window.location.href = "/";
  };

  const navItems = [
    { path: "/dashboard", label: "Exams", icon: FiHome },
    { path: "/teachers", label: "Teachers", icon: FiUsers },
    { path: "/students", label: "Students", icon: FiUserCheck },
    { path: "/all-results", label: "Results", icon: FiAward },
    { path: "/notifications", label: "Notifications", icon: FiBell },
    { path: "/analytics", label: "Analytics", icon: FiTrendingUp },
  ];

  const NavLinkStyle = ({ isActive }) =>
    `flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-white/10 ${
      isActive
        ? "bg-white/20 text-white shadow-lg scale-105"
        : "text-white/90 hover:text-white"
    }`;

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* LOGO */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl backdrop-blur-sm">
                <FiBarChart2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                MEA_ADMIN
              </span>
            </div>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.path} to={item.path} className={NavLinkStyle}>
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            {/* DESKTOP LOGOUT ONLY */}
            <div className="hidden md:flex items-center">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
              >
                <FiLogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE NAVIGATION */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden z-50 relative ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pt-2 pb-4 space-y-1 bg-blue-700/50 border-t border-white/10">

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-white/20 text-white shadow-lg"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              );
            })}

            {/* MOBILE LOGOUT ONLY */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 mt-3 text-red-300 hover:bg-white/10 rounded-xl transition-colors duration-200"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE BACKDROP */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
