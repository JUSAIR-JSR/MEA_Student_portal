import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAllResultsDetailed, deleteResult } from "../api/api";

// Import icons
import {
  FiAward,
  FiTrendingUp,
  FiUsers,
  FiBook,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiTrash2,
  FiDownload,
  FiEye,
  FiBarChart2,
  FiPercent,
  FiCalendar,
  FiUser,
  FiMail,
  FiHash,
  FiBriefcase,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle
} from "react-icons/fi";

export default function AllResults() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    department: "all",
    subject: "all",
    grade: "all",
    dateRange: "all"
  });

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    setIsLoading(true);
    try {
      const res = await getAllResultsDetailed();
      setResults(res.data);
    } catch (err) {
      console.error("❌ Failed to load results:", err);
    }
    setIsLoading(false);
  };

  const handleDeleteResult = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this result permanently?");
    if (!confirmDelete) return;

    setIsLoading(true);
    try {
      await deleteResult(id);
      await loadResults();
    } catch (error) {
      console.error("❌ Failed to delete result:", error);
      alert("Error deleting result!");
    }
    setIsLoading(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get unique values for filters
  const departments = [...new Set(results.map(r => r.studentId?.department).filter(Boolean))];
  const subjects = [...new Set(results.map(r => r.subject).filter(Boolean))];
  const grades = [...new Set(results.map(r => r.grade).filter(Boolean))];

  // Filter results
  const filteredResults = results.filter(result => {
    const matchesSearch = 
      result.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.studentId?.rollNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.studentId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.examId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.subject?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = filters.department === "all" || result.studentId?.department === filters.department;
    const matchesSubject = filters.subject === "all" || result.subject === filters.subject;
    const matchesGrade = filters.grade === "all" || result.grade === filters.grade;

    return matchesSearch && matchesDepartment && matchesSubject && matchesGrade;
  });

  // Statistics calculations
  const totalResults = results.length;
  const averageMarks = results.length > 0 
    ? (results.reduce((sum, r) => sum + (r.marks || 0), 0) / results.length).toFixed(1)
    : 0;
  
  const passedStudents = results.filter(r => {
    const marks = r.marks || 0;
    return marks >= 33; // Assuming passing marks are 33
  }).length;

  const passPercentage = totalResults > 0 ? ((passedStudents / totalResults) * 100).toFixed(1) : 0;

  // Grade distribution
  const gradeDistribution = {
    'A+': results.filter(r => r.grade === 'A+').length,
    'A': results.filter(r => r.grade === 'A').length,
    'B+': results.filter(r => r.grade === 'B+').length,
    'B': results.filter(r => r.grade === 'B').length,
    'C': results.filter(r => r.grade === 'C').length,
    'D': results.filter(r => r.grade === 'D').length,
    'F': results.filter(r => r.grade === 'F').length,
  };

  const getGradeColor = (grade) => {
    const gradeColors = {
      'A+': 'bg-gradient-to-r from-green-500 to-emerald-600',
      'A': 'bg-gradient-to-r from-green-400 to-green-600',
      'B+': 'bg-gradient-to-r from-blue-400 to-blue-600',
      'B': 'bg-gradient-to-r from-blue-300 to-blue-500',
      'C': 'bg-gradient-to-r from-yellow-400 to-yellow-600',
      'D': 'bg-gradient-to-r from-orange-400 to-orange-600',
      'F': 'bg-gradient-to-r from-red-500 to-red-600',
    };
    return gradeColors[grade] || 'bg-gray-500';
  };

  const getStatusIcon = (marks) => {
    if (marks >= 75) return <FiTrendingUp className="w-4 h-4" />;
    if (marks >= 33) return <FiCheckCircle className="w-4 h-4" />;
    return <FiXCircle className="w-4 h-4" />;
  };

  const getStatusColor = (marks) => {
    if (marks >= 75) return "text-green-600 bg-green-100";
    if (marks >= 33) return "text-blue-600 bg-blue-100";
    return "text-red-600 bg-red-100";
  };

  const getStatusText = (marks) => {
    if (marks >= 75) return "Excellent";
    if (marks >= 33) return "Pass";
    return "Fail";
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <FiAward className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Student Results</h1>
                <p className="text-slate-600 mt-1">Comprehensive results analysis and management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  // Export functionality would go here
                  alert("Export functionality would be implemented here");
                }}
                className="flex items-center space-x-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors duration-200"
              >
                <FiDownload className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              <button
                onClick={loadResults}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors duration-200 disabled:opacity-50"
              >
                <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Results</p>
                  <p className="text-2xl font-bold mt-1">{totalResults}</p>
                </div>
                <FiAward className="w-8 h-8 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Average Marks</p>
                  <p className="text-2xl font-bold mt-1">{averageMarks}</p>
                </div>
                <FiTrendingUp className="w-8 h-8 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Pass Percentage</p>
                  <p className="text-2xl font-bold mt-1">{passPercentage}%</p>
                </div>
                <FiPercent className="w-8 h-8 text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Passed Students</p>
                  <p className="text-2xl font-bold mt-1">{passedStudents}</p>
                </div>
                <FiUsers className="w-8 h-8 text-amber-200" />
              </div>
            </div>
          </div>

          {/* Grade Distribution */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
              <FiBarChart2 className="w-5 h-5" />
              <span>Grade Distribution</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {Object.entries(gradeDistribution).map(([grade, count]) => (
                <div key={grade} className="text-center">
                  <div className={`${getGradeColor(grade)} text-white rounded-xl p-4 mb-2 shadow-lg`}>
                    <p className="text-lg font-bold">{grade}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-800">{count}</p>
                  <p className="text-xs text-slate-600">students</p>
                </div>
              ))}
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search results..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-64"
                  />
                </div>
                
                <select
                  value={filters.department}
                  onChange={(e) => setFilters({...filters, department: e.target.value})}
                  className="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>

                <select
                  value={filters.subject}
                  onChange={(e) => setFilters({...filters, subject: e.target.value})}
                  className="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>

                <select
                  value={filters.grade}
                  onChange={(e) => setFilters({...filters, grade: e.target.value})}
                  className="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Grades</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-slate-600">
                Showing {filteredResults.length} of {totalResults} results
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-gray-50 to-blue-50/30">
              <h2 className="text-xl font-bold text-slate-800">All Student Results</h2>
              <p className="text-slate-600 mt-1">Detailed view of all examination results</p>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiAward className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No results found</h3>
                <p className="text-slate-500 mb-6">
                  {searchTerm || filters.department !== "all" || filters.subject !== "all" || filters.grade !== "all"
                    ? "Try adjusting your search criteria" 
                    : "No results available"
                  }
                </p>
                {(searchTerm || filters.department !== "all" || filters.subject !== "all" || filters.grade !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilters({ department: "all", subject: "all", grade: "all", dateRange: "all" });
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-100 to-blue-100/50 border-b border-slate-200">
                      <th className="p-4 text-left text-sm font-semibold text-slate-700">Student</th>
                      <th className="p-4 text-left text-sm font-semibold text-slate-700">Roll No</th>
                      <th className="p-4 text-left text-sm font-semibold text-slate-700">Department</th>
                      <th className="p-4 text-left text-sm font-semibold text-slate-700">Exam</th>
                      <th className="p-4 text-left text-sm font-semibold text-slate-700">Date</th>
                      <th className="p-4 text-left text-sm font-semibold text-slate-700">Subject</th>
                      <th className="p-4 text-center text-sm font-semibold text-slate-700">Marks</th>
                      <th className="p-4 text-center text-sm font-semibold text-slate-700">Grade</th>
                      <th className="p-4 text-left text-sm font-semibold text-slate-700">Status</th>
                      <th className="p-4 text-left text-sm font-semibold text-slate-700">Teacher</th>
                      <th className="p-4 text-center text-sm font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredResults.map((r) => (
                      <tr key={r._id} className="hover:bg-blue-50/30 transition-all duration-200">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <FiUser className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{r.studentId?.name || "-"}</p>
                              <p className="text-xs text-slate-600">{r.studentId?.email || "-"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {r.studentId?.rollNo || "-"}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {r.studentId?.department || "-"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="max-w-xs">
                            <p className="font-medium text-slate-800 truncate">{r.examId?.title || "-"}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2 text-slate-700">
                            <FiCalendar className="w-4 h-4 text-slate-400" />
                            <span className="text-sm">{formatDate(r.examId?.date)}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {r.subject || "-"}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="font-bold text-slate-800 text-lg">
                            {r.marks ?? "-"}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold text-white ${getGradeColor(r.grade)}`}>
                            {r.grade || "-"}
                          </span>
                        </td>
                        <td className="p-4">
                          {r.marks !== undefined && r.marks !== null ? (
                            <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(r.marks)}`}>
                              {getStatusIcon(r.marks)}
                              <span>{getStatusText(r.marks)}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <FiAlertTriangle className="w-3 h-3" />
                              <span>Pending</span>
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="max-w-xs">
                            <p className="font-medium text-slate-800">{r.teacherId?.name || "-"}</p>
                            <p className="text-xs text-slate-600">{r.teacherId?.subject || "-"}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => {
                                // View details functionality
                                alert(`Viewing details for ${r.studentId?.name}'s result`);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                              title="View Details"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteResult(r._id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                              title="Delete Result"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}