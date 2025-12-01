import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

const handleLogout = async () => {
  try {
    await API.post("/auth/logout");
    window.location.href = "/";
  } catch {
    window.location.href = "/";
  }
};


  return (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white px-4 sm:px-6 py-4 flex justify-between items-center shadow-2xl relative">
      {/* Left Side */}
      <div className="flex items-center space-x-4 sm:space-x-6">
        {/* Logo/Brand */}
        <div 
          onClick={() => navigate("/dashboard")}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          {/* Animated Icon */}
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6l9-5-9-5-9 5 9 5z" />
              </svg>
            </div>
            {/* Pulsing dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
          
          <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent group-hover:from-yellow-200 group-hover:to-yellow-300 transition-all duration-300">
            Teacher Dashboard
          </h1>
        </div>

        {/* Dashboard Link - Desktop */}
        <button
          onClick={() => navigate("/dashboard")}
          className="hidden md:flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20 backdrop-blur-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Dashboard</span>
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden flex flex-col space-y-1.5 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
      >
        <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
        <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {/* Desktop Logout Button */}
      <button
        onClick={handleLogout}
        className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-600 px-6 py-2.5 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
      >
        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="font-semibold">Logout</span>
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-gradient-to-b from-purple-700 to-indigo-800 border-t border-white/20 shadow-2xl md:hidden">
          <div className="px-4 py-3 space-y-3">
            {/* Dashboard Mobile Link */}
            <button
              onClick={() => {
                navigate("/dashboard");
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 bg-white/10 px-4 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Dashboard</span>
            </button>

            {/* Logout Mobile Button */}
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 bg-gradient-to-r from-red-500 to-pink-600 px-4 py-3 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}