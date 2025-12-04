"use client";
import { useEffect, useState } from "react";
import { getStudentResults } from "@/app/api/axios";
import PageGuard from "@/components/PageGuard";
import { TrendingUp, Award, Calendar, FileText, Filter, Download, Loader2 } from "lucide-react";

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadResults();
  }, []);

  async function loadResults() {
    setLoading(true);
    try {
      const res = await getStudentResults();
      setResults(res.data || []);
    } catch (error) {
      console.error("Failed to load results:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredResults = results.filter(result => {
    if (filter === "all") return true;
    if (filter === "A+") return result.grade === "A+";
    if (filter === "A") return result.grade === "A";
    if (filter === "B") return result.grade?.startsWith("B");
    if (filter === "C") return result.grade?.startsWith("C");
    return true;
  });

  const stats = {
    total: results.length,
    average: results.length > 0 
      ? (results.reduce((sum, r) => sum + (r.marks || 0), 0) / results.length).toFixed(1)
      : 0,
    topGrade: results.length > 0 
      ? Math.max(...results.map(r => r.marks || 0))
      : 0,
  };

  const getGradeColor = (grade) => {
    if (!grade) return "bg-gray-100 text-gray-700";
    const gradeMap = {
      "A+": "bg-emerald-100 text-emerald-800 border-emerald-200",
      "A": "bg-green-100 text-green-800 border-green-200",
      "B+": "bg-blue-100 text-blue-800 border-blue-200",
      "B": "bg-sky-100 text-sky-800 border-sky-200",
      "C": "bg-amber-100 text-amber-800 border-amber-200",
      "D": "bg-orange-100 text-orange-800 border-orange-200",
      "F": "bg-red-100 text-red-800 border-red-200",
    };
    return gradeMap[grade] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getMarksColor = (marks) => {
    if (marks >= 80) return "text-emerald-600 font-bold";
    if (marks >= 60) return "text-blue-600 font-semibold";
    if (marks >= 35) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <PageGuard>
      <div className="min-h-screen bg-[linear-gradient(to_bottom_right,#f8fafc,#ffffff)] p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">My Results</h1>
              <p className="text-slate-600">Track your academic performance across all exams</p>
            </div>
            
            <button
              onClick={loadResults}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <Loader2 className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Refreshing..." : "Refresh Results"}</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm text-slate-500">Total Exams</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="text-sm text-slate-500">Average Marks</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{stats.average}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-50 rounded-lg">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <span className="text-sm text-slate-500">Highest Score</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{stats.topGrade}</p>
            </div>
          </div>

          {/* Filter and Table Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Filter className="w-5 h-5 text-slate-400" />
                  <h2 className="text-lg font-semibold text-slate-800">All Results</h2>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                    {filteredResults.length} records
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">Filter by grade:</span>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="all">All Grades</option>
                    <option value="A+">A+ Only</option>
                    <option value="A">A Only</option>
                    <option value="B">B Grades</option>
                    <option value="C">C Grades</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-600 font-medium">Loading results...</p>
                </div>
              ) : filteredResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <FileText className="w-16 h-16 text-slate-300 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    {filter === "all" ? "No results found" : "No results match your filter"}
                  </h3>
                  <p className="text-slate-500 max-w-md">
                    {filter === "all" 
                      ? "You haven't taken any exams yet. Results will appear here once they're published."
                      : "Try selecting a different grade filter or check back later for new results."}
                  </p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-4 text-left text-sm font-semibold text-slate-600">Exam Title</th>
                      <th className="p-4 text-left text-sm font-semibold text-slate-600">Subject</th>
                      <th className="p-4 text-left text-sm font-semibold text-slate-600">Date</th>
                      <th className="p-4 text-left text-sm font-semibold text-slate-600">Marks</th>
                      <th className="p-4 text-left text-sm font-semibold text-slate-600">Grade</th>
                      <th className="p-4 text-left text-sm font-semibold text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map((result, index) => (
                      <tr 
                        key={result._id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors group"
                      >
                        <td className="p-4">
                          <div className="font-medium text-slate-800">{result.examId?.title}</div>
                          <div className="text-sm text-slate-500 mt-1">
                            Duration: {result.examId?.duration || "N/A"} mins
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="font-medium text-slate-700">{result.subject}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              {new Date(result.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className={`text-lg font-semibold ${getMarksColor(result.marks)}`}>
                            {result.marks}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-lg font-medium border ${getGradeColor(result.grade)}`}>
                            {result.grade || "N/A"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              result.marks >= 35 ? "bg-emerald-500" : "bg-red-500"
                            }`}></div>
                            <span className="text-sm text-slate-600">
                              {result.marks >= 35 ? "Passed" : "Failed"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Table Footer */}
            {filteredResults.length > 0 && (
              <div className="p-4 border-t border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Showing {filteredResults.length} of {results.length} results</span>
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                    <Download className="w-4 h-4" />
                    Export Results
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Performance Note */}
          {filteredResults.length > 0 && (
            <div className="bg-[linear-gradient(to_bottom_right,#eff6ff,#eef2ff)] border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">Performance Summary</h3>
                  <p className="text-slate-600">
                    Based on your recent results, you're performing well! Keep up the good work and 
                    continue focusing on your studies. Your average score is {stats.average} marks.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageGuard>
  );
}