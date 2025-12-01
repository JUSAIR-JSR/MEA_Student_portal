// src/pages/Login.jsx
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { studentLogin } from "../api/api";
import { 
  LockClosedIcon, 
  UserCircleIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  CommandLineIcon
} from "@heroicons/react/24/outline";

export default function Login() {
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({ rollNo: false, password: false });
  const navigate = useNavigate();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await studentLogin({ rollNo, password });
      navigate("/student-dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Premium Particle Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            background: {
              color: {
                value: "transparent",
              },
            },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: "push",
                },
                onHover: {
                  enable: true,
                  mode: "repulse",
                  parallax: {
                    enable: false,
                    force: 60,
                    smooth: 10
                  }
                },
                resize: true,
              },
              modes: {
                push: {
                  quantity: 4,
                },
                repulse: {
                  distance: 200,
                  duration: 0.4,
                },
                bubble: {
                  distance: 400,
                  size: 40,
                  duration: 2,
                  opacity: 0.8,
                  speed: 3
                }
              },
            },
            particles: {
              color: {
                value: ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981"],
              },
              links: {
                color: "#93c5fd",
                distance: 150,
                enable: true,
                opacity: 0.1,
                width: 1,
                triangles: {
                  enable: true,
                  color: "#dbeafe",
                  opacity: 0.03
                }
              },
              collisions: {
                enable: true,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: true,
                speed: 7,
                straight: false,
                attract: {
                  enable: true,
                  rotateX: 600,
                  rotateY: 1200
                }
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 60,
              },
              opacity: {
                value: 0.3,
                animation: {
                  enable: true,
                  speed: 1,
                  minimumValue: 0.1,
                  sync: false
                }
              },
              shape: {
                type: ["circle", "triangle", "polygon"],
                polygon: {
                  nb_sides: 6
                }
              },
              size: {
                value: { min: 1, max: 4 },
                animation: {
                  enable: true,
                  speed: 4,
                  minimumValue: 0.1,
                  sync: false
                }
              },
              wobble: {
                enable: true,
                distance: 10,
                speed: 0.5
              },
              twinkle: {
                particles: {
                  enable: true,
                  color: "#ffffff",
                  frequency: 0.05,
                  opacity: 1
                }
              }
            },
            detectRetina: true,
            motion: {
              disable: false,
              reduce: {
                factor: 4,
                value: true
              }
            },
            emitters: {
              direction: "none",
              rate: {
                quantity: 1,
                delay: 3
              },
              size: {
                width: 100,
                height: 100
              },
              position: {
                x: 50,
                y: 50
              }
            }
          }}
        />
        
        {/* Animated gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 animate-pulse" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent animate-shimmer" />
      </div>

      {/* Floating Tech Icons */}
      <div className="absolute top-10 left-10 z-10 animate-float">
        <CommandLineIcon className="w-8 h-8 text-blue-400/30" />
      </div>
      <div className="absolute bottom-10 right-10 z-10 animate-float" style={{ animationDelay: "1s" }}>
        <SparklesIcon className="w-8 h-8 text-purple-400/30" />
      </div>
      <div className="absolute top-1/4 right-1/4 z-10 animate-float" style={{ animationDelay: "2s" }}>
        <AcademicCapIcon className="w-6 h-6 text-cyan-400/30" />
      </div>

      {/* Main Content */}
      <div className="max-w-md w-full relative z-20">
        
        {/* Header with enhanced animation */}
        <div className="text-center mb-10 relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="w-32 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-full blur-sm animate-pulse" />
          </div>
          
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft mb-6 border border-white/20 
            hover:shadow-gentle transition-all duration-300 group relative overflow-hidden">
            {/* Animated ring */}
            <div className="absolute inset-0 border-2 border-transparent rounded-2xl animate-spin-slow"
                 style={{ borderImage: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4) 1' }} />
            
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center
              shadow-inner relative z-10">
              <AcademicCapIcon className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-600 font-medium">Sign in to your student portal</p>
          <div className="flex items-center justify-center mt-2">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse" />
            <span className="mx-3 text-xs font-semibold text-blue-500 tracking-widest animate-pulse">
              MIDDLE EAST ACADEMY
            </span>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse" />
          </div>
        </div>

        {/* Login Card with glass effect */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-gentle border border-white/20 p-8 transition-all duration-300
          hover:shadow-soft-xl relative overflow-hidden">
          
          {/* Card background effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-blue-50/50 opacity-90" />
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-100/20 via-transparent to-purple-100/20 blur-xl animate-pulse" />
          
          <form onSubmit={handleLogin} className="space-y-7 relative z-10">
            
            {/* Error Message */}
            {error && (
              <div className="animate-fadeIn bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-xl p-4 flex items-center space-x-3 
                shadow-sm">
                <div className="relative">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-400 flex-shrink-0 animate-pulse" />
                  <div className="absolute inset-0 w-5 h-5 bg-red-400 rounded-full animate-ping opacity-20" />
                </div>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Roll Number Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <UserCircleIcon className="w-4 h-4 mr-2 text-gray-400" />
                Roll Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your roll number"
                  className={`w-full bg-gray-50/50 backdrop-blur-sm border rounded-xl pl-12 pr-4 py-4 focus:outline-none transition-all duration-300
                    placeholder-gray-400 font-medium
                    ${isFocused.rollNo 
                      ? 'border-blue-400 shadow-sm shadow-blue-100/50 bg-white ring-2 ring-blue-100/50' 
                      : 'border-gray-200/50 hover:border-gray-300'}`}
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  onFocus={() => setIsFocused({ ...isFocused, rollNo: true })}
                  onBlur={() => setIsFocused({ ...isFocused, rollNo: false })}
                  required
                />
                <UserCircleIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                {isFocused.rollNo && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                  </div>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <LockClosedIcon className="w-4 h-4 mr-2 text-gray-400" />
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password"
                  className={`w-full bg-gray-50/50 backdrop-blur-sm border rounded-xl pl-12 pr-4 py-4 focus:outline-none transition-all duration-300
                    placeholder-gray-400 font-medium
                    ${isFocused.password 
                      ? 'border-blue-400 shadow-sm shadow-blue-100/50 bg-white ring-2 ring-blue-100/50' 
                      : 'border-gray-200/50 hover:border-gray-300'}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused({ ...isFocused, password: true })}
                  onBlur={() => setIsFocused({ ...isFocused, password: false })}
                  required
                />
                <LockClosedIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                {isFocused.password && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-ping" />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl py-4 font-semibold 
                shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2
                active:translate-y-0 relative overflow-hidden group`}
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10" />
                  <span className="relative z-10">Signing in...</span>
                </>
              ) : (
                <>
                  <span className="relative z-10">Sign In</span>
                  <ArrowRightOnRectangleIcon className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform relative z-10" />
                </>
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-100/50 text-center relative z-10">
            <p className="text-sm text-gray-500 font-medium">
              Having trouble signing in?{" "}
              <a href="mailto:middleeastacademymanjeri@gmail.com" 
                 className="text-blue-500 hover:text-blue-600 font-semibold transition-colors relative group">
                Contact admin
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
          </div>
          <p className="text-xs text-gray-500 font-medium mt-4 tracking-wide bg-white/50 backdrop-blur-sm rounded-lg py-2">
            Secure Student Portal System • © Middle East Academy
          </p>
        </div>
      </div>
    </div>
  );
}