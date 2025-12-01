import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { getExamStudents, saveResult, deleteResult } from "../api/api";

export default function ExamDetails() {
  const { examId } = useParams();
  const [examTitle, setExamTitle] = useState("");
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [marks, setMarks] = useState({});
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    graded: 0,
    pending: 0
  });

  useEffect(() => {
    loadExamData();
  }, []);

  const loadExamData = async () => {
    try {
      setLoading(true);
      const res = await getExamStudents(examId);
      setExamTitle(res.data.examTitle);
      setStudents(res.data.students);
      
      // Calculate stats
      const graded = res.data.students.filter(s => s.marks || s.grade).length;
      setStats({
        total: res.data.students.length,
        graded,
        pending: res.data.students.length - graded
      });
    } catch (error) {
      console.error("Failed to load exam data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (studentId) => {
    try {
      setSaving(true);
      const gradeValue = grades[studentId]?.trim() || "N/A";
      const marksValue = marks[studentId] || 0;
      
      const data = {
        studentId,
        marks: marksValue,
        grade: gradeValue,
      };
      
      await saveResult(examId, data);
      setEditingId(null);
      await loadExamData();
      
      // Show success feedback
      showNotification("✅ Result saved successfully", "success");
    } catch (err) {
      showNotification("❌ Failed to save result", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (resultId) => {
    if (!window.confirm("Are you sure you want to delete this result?")) return;
    
    try {
      await deleteResult(resultId);
      await loadExamData();
      showNotification("🗑️ Result deleted successfully", "success");
    } catch (error) {
      showNotification("❌ Failed to delete result", "error");
    }
  };

  const showNotification = (message, type) => {
    // You can replace this with a proper toast notification library
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-xl shadow-lg text-white font-medium transform translate-x-full transition-transform duration-300 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  const getGradeColor = (grade) => {
    if (!grade || grade === "N/A" || grade === "-") return "gray";
    
    const gradeColors = {
      'A+': 'from-emerald-500 to-green-500',
      'A': 'from-green-500 to-lime-500',
      'B+': 'from-lime-500 to-yellow-500',
      'B': 'from-yellow-500 to-amber-500',
      'C+': 'from-amber-500 to-orange-500',
      'C': 'from-orange-500 to-red-500',
      'D': 'from-red-500 to-pink-500',
      'F': 'from-red-600 to-rose-600',
      'default': 'from-blue-500 to-cyan-500'
    };
    
    return gradeColors[grade] || gradeColors.default;
  };

  const getMarksColor = (marks) => {
    if (!marks && marks !== 0) return "text-gray-500";
    const numericMarks = parseInt(marks);
    if (numericMarks >= 80) return "text-green-600 font-bold";
    if (numericMarks >= 60) return "text-blue-600";
    if (numericMarks >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <>
      <Navbar />
      
      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Manage Results
                </h1>
                <p className="text-gray-600 text-lg">
                  for <span className="font-semibold text-blue-700">{examTitle}</span>
                </p>
              </div>
              
              {/* Refresh Button */}
              <button
                onClick={loadExamData}
                disabled={loading}
                className="mt-4 lg:mt-0 inline-flex items-center space-x-2 bg-white px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-200"
              >
                <svg 
                  className={`w-5 h-5 text-blue-600 ${loading ? 'animate-spin' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="font-medium text-gray-700">Refresh</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Students</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Graded</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{stats.graded}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
                  </div>
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {/* Table Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600">
              <h2 className="text-xl font-bold text-white">Student Results</h2>
            </div>

            {loading ? (
              // Loading Skeleton
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex space-x-4 items-center">
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/6"></div>
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
                      <th className="p-4 text-left font-semibold text-gray-700">Student</th>
                      <th className="p-4 text-left font-semibold text-gray-700">Roll No</th>
                      <th className="p-4 text-center font-semibold text-gray-700">Marks</th>
                      <th className="p-4 text-center font-semibold text-gray-700">Grade</th>
                      <th className="p-4 text-center font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr 
                        key={student._id} 
                        className="border-b border-gray-100 hover:bg-blue-50 transition-all duration-300 group"
                      >
                        {/* Student Name */}
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {student.name?.charAt(0).toUpperCase() || 'S'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{student.name}</p>
                              <p className="text-sm text-gray-500">ID: {student._id?.substring(0, 8)}...</p>
                            </div>
                          </div>
                        </td>

                        {/* Roll Number */}
                        <td className="p-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                            {student.rollNo}
                          </span>
                        </td>

                        {/* Marks */}
                        <td className="p-4 text-center">
                          {editingId === student._id ? (
                            <input
                              type="number"
                              value={marks[student._id] ?? student.marks ?? ""}
                              onChange={(e) =>
                                setMarks({ ...marks, [student._id]: e.target.value })
                              }
                              className="border border-gray-300 p-2 rounded-xl w-20 text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              placeholder="0"
                              min="0"
                              max="100"
                            />
                          ) : (
                            <span className={`text-lg font-semibold ${getMarksColor(student.marks)}`}>
                              {student.marks || (
                                <span className="text-gray-400 italic">Not set</span>
                              )}
                            </span>
                          )}
                        </td>

                        {/* Grade */}
                        <td className="p-4 text-center">
                          {editingId === student._id ? (
                            <input
                              type="text"
                              value={grades[student._id] ?? student.grade ?? ""}
                              onChange={(e) =>
                                setGrades({ ...grades, [student._id]: e.target.value.toUpperCase() })
                              }
                              className="border border-gray-300 p-2 rounded-xl w-20 text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all uppercase"
                              placeholder="A+"
                              maxLength="2"
                            />
                          ) : student.grade && student.grade !== "N/A" ? (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-bold bg-gradient-to-r ${getGradeColor(student.grade)}`}>
                              {student.grade}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">Not set</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-center">
                          <div className="flex justify-center space-x-2">
                            {editingId === student._id ? (
                              <>
                                <button
                                  onClick={() => handleSave(student._id)}
                                  disabled={saving}
                                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {saving ? (
                                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                  ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                  <span>{saving ? "Saving..." : "Save"}</span>
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="inline-flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  <span>Cancel</span>
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingId(student._id);
                                    setMarks(prev => ({ ...prev, [student._id]: student.marks }));
                                    setGrades(prev => ({ ...prev, [student._id]: student.grade }));
                                  }}
                                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-4 py-2 rounded-xl hover:from-yellow-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  <span>Edit</span>
                                </button>
                                {student.resultId && (
                                  <button
                                    onClick={() => handleDelete(student.resultId)}
                                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span>Delete</span>
                                  </button>
                                )}
                              </>
                            )}
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