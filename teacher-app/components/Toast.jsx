"use client";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export default function Toast({ type = "success", message = "", duration = 4000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  const config = {
    success: {
      bg: "bg-gradient-to-r from-emerald-500 to-green-500",
      border: "border-emerald-400/30",
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Success",
    },
    error: {
      bg: "bg-gradient-to-r from-rose-500 to-red-500",
      border: "border-rose-400/30",
      icon: <XCircle className="w-5 h-5" />,
      title: "Error",
    },
  }[type];

  return (
    <div className="fixed top-6 right-6 z-50 animate-fade-in-up">
      <div
        className={`${config.bg} text-white px-5 py-4 rounded-xl shadow-lg border ${config.border} backdrop-blur-sm backdrop-opacity-90 min-w-[280px] max-w-md transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{config.icon}</div>
          <div className="flex-1">
            <p className="font-medium text-sm mb-1">{config.title}</p>
            <p className="text-white/90 text-sm">{message}</p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-xl overflow-hidden">
          <div 
            className="h-full bg-white/50 rounded-b-xl"
            style={{
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shrink {
          0% {
            width: 100%;
          }
          100% {
            width: 0%;
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}