import { useEffect, useState } from "react";
import { adminLogin } from "../api/api";
import API from "../api/api";

// Import icons
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLogIn,
  FiUser,
  FiPhone,
  FiShield,
  FiAlertCircle,
  FiCheckCircle,
  FiBookOpen
} from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // Replace with your Google Client ID
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "<YOUR_GOOGLE_CLIENT_ID>";

  useEffect(() => {
    // Update current time
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));
    }, 1000);

    // Load Google script
    const existing = document.getElementById("google-client-script");
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.id = "google-client-script";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => renderButton();
    } else {
      renderButton();
    }

    function renderButton() {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          ux_mode: "popup",
        });

        // Render the Google button
        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInDiv"),
          { 
            theme: "filled_blue", 
            size: "large", 
            width: "280",
            text: "continue_with",
            shape: "pill"
          }
        );
      }
    }

    return () => clearInterval(timer);
  }, []);

  // ⭐ Secure Google Login handler
  const handleCredentialResponse = async (response) => {
    setIsLoading(true);
    setError("");

    try {
      await API.post("/auth/google", {
        credential: response.credential,
      });

      // ⭐ Cookie is automatically set by backend
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Google sign-in error", err);
      setError(
        err.response?.data?.message || "Google sign-in failed. Please try again."
      );
    }

    setIsLoading(false);
  };

  // ⭐ Secure Admin Login using HttpOnly cookies
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      await adminLogin({ email, password });

      // ⭐ No localStorage — Cookie is handled automatically
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }

    setIsLoading(false);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 mb-6 p-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <FiBookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MiddleEastAcademy Admin
            </h1>
          </div>
          <p className="text-slate-600 text-sm">Educational Management System</p>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-center space-x-2">
            <FiPhone className="w-3 h-3" />
            <span>{currentTime}</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h2>
              <p className="text-slate-600">Sign in to your admin dashboard</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 animate-shake">
                <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-slate-700">
                  <FiMail className="w-4 h-4" />
                  <span>Email Address</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="admin@institution.edu"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-slate-700">
                  <FiLock className="w-4 h-4" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiShield className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                    ) : (
                      <FiEye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  onClick={() => alert("Password reset functionality would be implemented here")}
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <FiLogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-slate-300"></div>
              <div className="px-3 text-sm text-slate-500">or continue with</div>
              <div className="flex-1 border-t border-slate-300"></div>
            </div>

            {/* Google Sign In */}
            <div className="flex justify-center mb-4">
              <div id="googleSignInDiv" className="flex justify-center"></div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-start space-x-3">
                <FiCheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Secure Login</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Your credentials are encrypted and securely transmitted.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50/80 border-t border-slate-200 px-8 py-4">
            <div className="text-center">
              <p className="text-xs text-slate-500">
                © 2025 MiddleEastAcademy. All rights reserved.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                v2.1.0 • Educational Management System
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations to tailwind config */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}