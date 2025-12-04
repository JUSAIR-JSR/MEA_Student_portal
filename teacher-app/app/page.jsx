"use client";
import { useState } from "react";
import { teacherLogin } from "./api/axios";
import { LogIn, Lock, Mail, Eye, EyeOff, BookOpen } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await teacherLogin({ email, password });
      // Add success animation before redirect
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          {/* Decorative header */}
          <div className="bg-white p-8 text-center border-b border-slate-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[linear-gradient(to_bottom_right,white,#f8fafc)] rounded-full mb-6 border border-blue-100">
              <BookOpen className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Teacher Login</h1>
            <p className="text-slate-600">Sign in to access your dashboard</p>
          </div>

          <div className="p-8">
            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-pulse">
                <div className="flex items-center gap-3 text-red-700">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold">!</span>
                  </div>
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="teacher@school.edu"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:border-slate-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:border-slate-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
                  Remember me
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full group relative overflow-hidden bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <LogIn className="w-5 h-5" />
                  )}
                  <span>{loading ? "Signing In..." : "Sign In"}</span>
                </div>
                
                {/* Button hover effect */}
                <div className="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              {/* Demo credentials */}
              <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600 font-medium mb-2">Demo Credentials:</p>
                <div className="text-xs text-slate-500 space-y-1">
                  <p>Email: teacher@example.com</p>
                  <p>Password: demo123</p>
                </div>
              </div>
            </form>

            {/* Footer note */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-center text-sm text-slate-500">
                Need help? Contact middleeastacademymanjeri@gamil.com
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} Middle East Academy</p>
        </div>
      </div>

      {/* Animated floating elements */}
      <div className="fixed top-20 left-10 w-3 h-3 bg-blue-300 rounded-full animate-bounce opacity-70"></div>
      <div className="fixed bottom-20 right-10 w-4 h-4 bg-indigo-300 rounded-full animate-bounce delay-300 opacity-70"></div>
      <div className="fixed top-1/2 left-1/4 w-2 h-2 bg-slate-300 rounded-full animate-pulse opacity-60"></div>
    </div>
  );
}