import { useEffect, useState } from "react";
import { getStudentResults } from "../api/api";

export default function StudentResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const res = await getStudentResults();
      setResults(res.data);
    } catch (error) {
      console.error("Failed to load results:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    switch (grade?.toUpperCase()) {
      case 'A': return 'bg-green-100 text-green-800 border-green-200';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'D': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'F': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMarksColor = (marks) => {
    if (marks >= 90) return 'text-green-600 font-bold';
    if (marks >= 75) return 'text-blue-600 font-semibold';
    if (marks >= 60) return 'text-yellow-600 font-semibold';
    if (marks >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4 border border-blue-100">
            <span className="text-2xl text-blue-600">📊</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Results</h1>
          <p className="text-gray-600">Your academic performance overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100 text-center">
            <p className="text-2xl font-bold text-blue-600">{results.length}</p>
            <p className="text-sm text-gray-600">Total Exams</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100 text-center">
            <p className="text-2xl font-bold text-green-600">
              {results.filter(r => r.grade === 'A' || r.grade === 'B').length}
            </p>
            <p className="text-sm text-gray-600">A & B Grades</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100 text-center">
            <p className="text-2xl font-bold text-orange-600">
              {results.filter(r => r.grade === 'C' || r.grade === 'D').length}
            </p>
            <p className="text-sm text-gray-600">C & D Grades</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100 text-center">
            <p className="text-2xl font-bold text-red-600">
              {results.filter(r => r.grade === 'F').length}
            </p>
            <p className="text-sm text-gray-600">F Grades</p>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Exam Results</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading results...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-gray-400">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h3>
              <p className="text-gray-600">Your exam results will appear here once available.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-50 border-b border-blue-100">
                    <th className="p-4 text-left font-semibold text-gray-700">Exam</th>
                    <th className="p-4 text-left font-semibold text-gray-700">Subject</th>
                    <th className="p-4 text-left font-semibold text-gray-700">Date</th>
                    <th className="p-4 text-center font-semibold text-gray-700">Marks</th>
                    <th className="p-4 text-center font-semibold text-gray-700">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr 
                      key={result._id} 
                      className={`border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="p-4">
                        <div className="font-medium text-gray-800">
                          {result.examId?.title || "-"}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-700">{result.subject || "-"}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-600">
                          {result.examId?.date
                            ? new Date(result.examId.date).toLocaleDateString("en-IN", {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })
                            : "-"}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-lg ${getMarksColor(result.marks)}`}>
                          {result.marks ?? "-"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {result.grade ? (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getGradeColor(result.grade)}`}>
                            {result.grade}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        {!loading && results.length > 0 && (
          <div className="text-center mt-6">
            <button
              onClick={loadResults}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <span>🔄</span>
              <span>Refresh Results</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}