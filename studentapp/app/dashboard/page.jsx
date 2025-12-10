"use client";
import { useEffect, useState } from "react";
import { getStudentResults } from "@/app/api/axios";
import PageGuard from "@/components/PageGuard";
import { Award, RefreshCw, Calendar, BookOpen, User, FileText, Star } from "lucide-react";

export default function DashboardPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const res = await getStudentResults();

      if (res.data?.length) {
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setResult(sorted[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <PageGuard>
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading your dashboard...</p>
          </div>
        </div>
      </PageGuard>
    );
  }

  return (
    <PageGuard>
      <div className="min-h-screen bg-[linear-gradient(to_bottom_right,#f8fafc,#eff6ff)]
 p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                Student Dashboard
              </h1>
              <p className="text-slate-600">
                View your latest exam results and achievements
              </p>
            </div>

            <button
              onClick={load}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Refreshing..." : "Refresh"}</span>
            </button>
          </div>

          {/* No result */}
          {!result ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                No Results Available
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Your results will appear here once published.
              </p>
            </div>
          ) : (
            <div className="space-y-8">

              {/* Certificate-style result card */}
              <div className="bg-[linear-gradient(to_bottom_right,#ffffff,#eff6ff)] rounded-2xl shadow-lg border border-slate-200 p-8 relative overflow-hidden">

                {/* Decorative blur circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-16 translate-x-16 blur-2xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-100 rounded-full translate-y-16 -translate-x-16 blur-2xl opacity-50"></div>

                <div className="relative z-10">

                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[linear-gradient(to_bottom_right,#3b82f6,#4f46e5)] rounded-xl flex items-center justify-center shadow">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800">Certificate of Achievement</h2>
                        <p className="text-slate-500 text-sm">Latest Exam Result</p>
                      </div>
                    </div>

                    <div className="hidden md:block px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
                      latest
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-[linear-gradient(to_bottom_right,#dbeafe,#e0e7ff)] rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">{result?.studentId?.name ?? "Unknown Student"}</h3>
                        <div className="flex items-center gap-4 text-slate-600 mt-1">
                          <span className="flex items-center gap-2">
                            <span className="text-sm">Roll No:</span>
                            <span className="font-semibold">{result?.studentId?.rollNo || "-"}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Exam Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-5 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Exam</p>
                          <p className="font-semibold text-slate-800">{result?.examId?.title || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Subject</p>
                          <p className="font-semibold text-slate-800">{result?.subject || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[linear-gradient(to_bottom_right,#eff6ff,#ffffff)] p-5 rounded-xl border border-blue-100">
                      <p className="text-sm text-slate-600 mb-2">Marks Obtained</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-blue-600">{result?.marks ?? "-"}</span>
                        <span className="text-slate-500">points</span>
                      </div>
                    </div>

                    <div className="bg-[linear-gradient(to_bottom_right,#ecfdf5,#ffffff)] p-5 rounded-xl border border-emerald-100">
                      <p className="text-sm text-slate-600 mb-2">Grade</p>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-emerald-600">{result?.grade || "-"}</span>
                        {(result.grade === "A+" || result.grade === "A") && (
                          <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                        )}
                      </div>
                    </div>

                    <div className="bg-[linear-gradient(to_bottom_right,#f8fafc,#ffffff)] p-5 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <p className="text-sm text-slate-600">Date</p>
                      </div>
                      <p className="text-lg font-semibold text-slate-800">
                      {result?.createdAt
                      ? new Date(result.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                      : "N/A"
                      }
                      </p>
                    </div>
                  </div>

                  {/* Footer Watermark */}
                  <div className="text-center text-slate-300 text-sm mt-8">
                    Verified and issued by the examination board
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Message */}
          {result && (
            <div className="text-center text-slate-500 text-sm mt-12">
              <p>If you have questions about your result, contact your instructor.</p>
            </div>
          )}
        </div>
      </div>
    </PageGuard>
  );
}
