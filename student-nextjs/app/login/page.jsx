"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { studentLogin } from "@/app/api/axios";
import { Loader2, LogIn, User, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await studentLogin({ rollNo, password });
      // Success animation before redirect
      const button = e.target.querySelector('button[type="submit"]');
      button.classList.add('scale-95');
      setTimeout(() => {
        router.replace("/dashboard");
      }, 300);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      // Error shake animation
      const form = e.target;
      form.classList.add('animate-shake');
      setTimeout(() => form.classList.remove('animate-shake'), 500);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      {/* Background animation elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>
      </div>

      {/* Floating animated dots */}
      <div className="absolute top-10 left-10 w-3 h-3 bg-blue-300 rounded-full animate-bounce"></div>
      <div className="absolute bottom-10 right-10 w-4 h-4 bg-indigo-300 rounded-full animate-bounce delay-300"></div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="p-8 text-center border-b border-slate-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[linear-gradient(to_bottom_right,#eff6ff,#dbeafe)]  rounded-full mb-4 border border-blue-200">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Student Login</h1>
            <p className="text-slate-600 text-sm">Access your exams and results</p>
          </div>

          <div className="p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3 text-red-700">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold">!</span>
                  </div>
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Roll Number */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Roll Number</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your roll number"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:border-slate-400"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
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

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember" className="text-sm text-slate-600">
                  Remember me on this device
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full group relative overflow-hidden bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <LogIn className="w-5 h-5" />
                  )}
                  <span>{loading ? "Signing In..." : "Login to Dashboard"}</span>
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </form>

            {/* Help Links */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="text-center space-y-3">
                <a href="#" className="block text-sm text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot your password?
                </a>
                <a href="#" className="block text-sm text-slate-500 hover:text-slate-700 transition-colors">
                  Need help logging in?
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            Secure student portal • © {new Date().getFullYear()}
          </p>
        </div>
      </div>

      {/* Custom animation styles */}
      <style jsx>{`
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