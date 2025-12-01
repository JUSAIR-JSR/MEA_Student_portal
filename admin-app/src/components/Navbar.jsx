import { useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";
import { adminLogout, getMe } from "../api/api";

// Import icons (you'll need to install react-icons)
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
  FiChevronDown
} from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await adminLogout(); // clears HttpOnly cookie
    window.location.href = "/";
  };

  // Mock user data - replace with actual user data from your context/API
  const userData = {
    name: "Admin User",
    role: "Administrator",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
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
      {/* Desktop Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl backdrop-blur-sm">
                <FiBarChart2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                MEA_ADMIN
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={NavLinkStyle}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            {/* User Profile & Actions */}
            <div className="flex items-center space-x-4">
              {/* Desktop Profile */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{userData.name}</p>
                  <p className="text-xs text-white/70">{userData.role}</p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                  >
                    <img
                      src={userData.avatar}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-white/20"
                    />
                    <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-5">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{userData.name}</p>
                        <p className="text-xs text-gray-500">{userData.role}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden z-50 relative ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-4 pt-2 pb-4 space-y-1 bg-blue-700/50 backdrop-blur-sm border-t border-white/10">
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
            
            {/* Mobile User Info & Logout */}
            <div className="pt-4 mt-4 border-t border-white/20">
              <div className="flex items-center space-x-3 px-4 py-2">
                <img
                  src={userData.avatar}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-white/20"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{userData.name}</p>
                  <p className="text-xs text-white/70">{userData.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-4 py-3 text-red-300 hover:bg-white/10 rounded-xl transition-colors duration-200"
              >
                <FiLogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop for mobile menu */}
{isMobileMenuOpen && (
  <div 
    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
    onClick={() => setIsMobileMenuOpen(false)}
  />
)}

    </>
  );
}