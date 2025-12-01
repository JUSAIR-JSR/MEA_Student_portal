// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

// Animated Icons
import {
  FiHome,
  FiBookOpen,
  FiUser,
  FiBell,
  FiLogOut
} from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);   // 🔐 secure state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ✔ Load user profile securely
  useEffect(() => {
    API.get("/auth/me")
      .then((res) => setProfile(res.data))
      .catch(() => setProfile(null));
  }, []);

  // ✔ Secure logout (delete cookie on backend)
  const handleLogout = async () => {
    await API.post("/auth/logout"); // backend clears cookie
    window.location.href = "/";
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo → Go to Dashboard */}
            <div
              onClick={() => navigate("/student-dashboard")}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl 
                              flex items-center justify-center shadow-lg group-hover:scale-110 
                              transition-transform duration-300">
                <span className="text-white font-bold text-lg">S</span>
              </div>

              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 
                             bg-clip-text text-transparent">
                Student Portal
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">

              <NavBtn 
                icon={<FiHome className="w-5 h-5" />} 
                text="Dashboard" 
                onClick={() => navigate("/student-dashboard")} 
              />

              <NavBtn 
                icon={<FiBookOpen className="w-5 h-5" />} 
                text="My Results" 
                onClick={() => navigate("/student-results")} 
              />

              <NavBtn 
                icon={<FiUser className="w-5 h-5" />} 
                text="Profile" 
                onClick={() => navigate("/student-profile")} 
              />

              <NavBtn 
                icon={<FiBell className="w-5 h-5" />} 
                text="Notifications" 
                onClick={() => navigate("/student-notifications")} 
                notify
              />

              {/* Secure Roll Number Display */}
              {profile?.rollNo && (
                <div className="ml-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 
                                text-white rounded-lg font-semibold shadow-lg">
                  {profile.rollNo}
                </div>
              )}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 ml-2 px-6 py-2 bg-gradient-to-r 
                           from-red-500 to-pink-600 text-white rounded-lg font-medium 
                           shadow-lg hover:shadow-xl transform hover:scale-105 
                           transition-all duration-200"
              >
                <FiLogOut className="w-5 h-5" />
                Logout
              </button>
            </div>

            {/* Mobile Icons */}
            <div className="flex md:hidden items-center space-x-3">

              <button
                onClick={() => navigate("/student-notifications")}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 
                           transition-all duration-200 relative"
              >
                <FiBell className="w-6 h-6 animate-pulse" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
              >
                {isMobileMenuOpen ? "✖" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pt-2 pb-4 space-y-2 bg-white border-t border-gray-200">

            <MobileItem icon={<FiHome />} text="Dashboard" onClick={() => navigate("/student-dashboard")} />
            <MobileItem icon={<FiBookOpen />} text="My Results" onClick={() => navigate("/student-results")} />
            <MobileItem icon={<FiUser />} text="Profile" onClick={() => navigate("/student-profile")} />
            <MobileItem icon={<FiBell />} text="Notifications" onClick={() => navigate("/student-notifications")} />

            {/* Mobile Roll Number */}
            {profile?.rollNo && (
              <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 
                              text-white rounded-lg font-semibold text-center mx-4">
                {profile.rollNo}
              </div>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 w-full px-4 py-3 
                        bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg 
                        font-medium mt-4 mx-4 justify-center"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

// Desktop Button Component
function NavBtn({ icon, text, onClick, notify }) {
  return (
    <button
      onClick={onClick}
      className="relative group flex items-center gap-2 px-4 py-2 text-gray-700 
                 hover:text-blue-600 font-medium rounded-lg hover:bg-gray-100 
                 transition-all duration-200 transform hover:-translate-y-0.5"
    >
      {icon}
      {text}
      {notify && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
      )}
    </button>
  );
}

// Mobile Menu Item
function MobileItem({ icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 
                hover:bg-gray-100 rounded-lg font-medium transition"
    >
      <div>{icon}</div>
      <span>{text}</span>
    </button>
  );
}
