import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAssignedExams } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    pending: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);
      const res = await getAssignedExams();
      setExams(res.data);
      
      // Calculate stats
      const published = res.data.filter(exam => exam.isPublished).length;
      setStats({
        total: res.data.length,
        published,
        pending: res.data.length - published
      });
    } catch (error) {
      console.error("Failed to load exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (isPublished) => {
    return isPublished ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
        Published
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
        Draft
      </span>
    );
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics': 'from-blue-500 to-cyan-500',
      'Science': 'from-green-500 to-emerald-500',
      'English': 'from-purple-500 to-pink-500',
      'History': 'from-orange-500 to-red-500',
      'Geography': 'from-teal-500 to-blue-500',
      'Physics': 'from-indigo-500 to-purple-500',
      'Chemistry': 'from-yellow-500 to-orange-500',
      'Biology': 'from-lime-500 to-green-500',
      'default': 'from-gray-500 to-gray-600'
    };
    return colors[subject] || colors.default;
  };

  return (
    <>
      <Navbar />
      
      {/* Main Content - Added proper top padding for mobile */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 pt-24 md:pt-6">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Exam Dashboard
              </h1>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg">Manage and monitor your assigned examinations</p>
            </div>
            
            {/* Refresh Button - Fixed for mobile */}
            <div className="w-full lg:w-auto">
              <button
                onClick={loadExams}
                disabled={loading}
                className="w-full lg:w-auto inline-flex items-center justify-center space-x-2 bg-white px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <svg 
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-blue-600 ${loading ? 'animate-spin' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="font-medium text-gray-700 text-sm sm:text-base">
                  {loading ? "Refreshing..." : "Refresh"}
                </span>
              </button>
            </div>
          </div>

          {/* Stats Cards - Improved mobile spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {/* Total Exams */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Exams</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1 sm:mt-2">{stats.total}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Published Exams */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Published</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1 sm:mt-2">{stats.published}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Pending Exams */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pending</p>
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mt-1 sm:mt-2">{stats.pending}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exams Table Section */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {/* Table Header */}
            <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600">
              <h2 className="text-lg sm:text-xl font-bold text-white">Assigned Exams</h2>
            </div>

            {loading ? (
              // Loading Skeleton
              <div className="p-4 sm:p-6 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex space-x-4 items-center">
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-3 sm:p-4 text-left font-semibold text-gray-700 text-sm sm:text-base">Exam Details</th>
                      <th className="p-3 sm:p-4 text-left font-semibold text-gray-700 text-sm sm:text-base">Subject</th>
                      <th className="p-3 sm:p-4 text-left font-semibold text-gray-700 text-sm sm:text-base">Date</th>
                      <th className="p-3 sm:p-4 text-center font-semibold text-gray-700 text-sm sm:text-base">Status</th>
                      <th className="p-3 sm:p-4 text-center font-semibold text-gray-700 text-sm sm:text-base">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.length > 0 ? (
                      exams.map((exam, index) => (
                        <tr 
                          key={exam._id} 
                          className="border-b border-gray-100 hover:bg-blue-50 transition-all duration-300 group cursor-pointer"
                          onClick={() => navigate(`/exam/${exam._id}`)}
                        >
                          <td className="p-3 sm:p-4">
                            <div className="flex items-center space-x-3">
                              <div className={`w-2 sm:w-3 h-8 sm:h-10 rounded-full bg-gradient-to-b ${getSubjectColor(exam.subject)}`}></div>
                              <div>
                                <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors text-sm sm:text-base">
                                  {exam.title}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                  ID: {exam._id.substring(0, 8)}...
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 sm:p-4">
                            <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                              {exam.subject || "General"}
                            </span>
                          </td>
                          <td className="p-3 sm:p-4">
                            <div className="flex items-center space-x-2">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-gray-700 text-sm sm:text-base">
                                {exam.date ? new Date(exam.date).toLocaleDateString() : "Not set"}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 sm:p-4 text-center">
                            {getStatusBadge(exam.isPublished)}
                          </td>
                          <td className="p-3 sm:p-4 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/exam/${exam._id}`);
                              }}
                              className="inline-flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg group text-xs sm:text-sm"
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-0.5 sm:group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                              <span>Manage</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-6 sm:p-8 text-center">
                          <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div>
                              <p className="text-gray-500 text-base sm:text-lg font-medium mb-1 sm:mb-2">No exams assigned</p>
                              <p className="text-gray-400 text-sm sm:text-base">You don't have any exams assigned to you yet.</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
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