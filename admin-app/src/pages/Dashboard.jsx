import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getExams,
  createExam,
  togglePublish,
  getTeachers,
  getStudents,
  assignExam,
  removeAssignment,
  updateExam,
  deleteExam,
} from "../api/api";

// Import icons
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiUser,
  FiBook,
  FiCalendar,
  FiEye,
  FiX,
  FiSend,
  FiArchive,
  FiCheckCircle,
  FiClock,
  FiFilter,
  FiDownload,
  FiRefreshCw
} from "react-icons/fi";

export default function Dashboard() {
  const [exams, setExams] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [subject, setSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showAssign, setShowAssign] = useState(false);
  const [showViewAssigned, setShowViewAssigned] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [teacherSearch, setTeacherSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    setIsLoading(true);
    try {
      const res = await getExams();
      setExams(res.data);
    } catch (error) {
      console.error("Error loading exams:", error);
    }
    setIsLoading(false);
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim() || !date) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await createExam({ title, subject, date });
      setTitle("");
      setDate("");
      setSubject("");
      setShowCreateForm(false);
      await loadExams();
    } catch (error) {
      console.error("Error creating exam:", error);
    }
    setIsLoading(false);
  };

  const handleTogglePublish = async (id) => {
    setIsLoading(true);
    await togglePublish(id);
    await loadExams();
    setIsLoading(false);
  };

  const handleOpenAssign = async (exam) => {
    setSelectedExam(exam);
    setShowAssign(true);
    setIsLoading(true);
    try {
      const [tRes, sRes] = await Promise.all([getTeachers(), getStudents()]);
      setTeachers(tRes.data);
      setStudents(sRes.data);
      setSelectedTeachers(exam.teacherIds.map((t) => t._id));
      setSelectedStudents(exam.studentIds.map((s) => s._id));
    } catch (error) {
      console.error("Error loading assignment data:", error);
    }
    setIsLoading(false);
  };

  const handleAssign = async () => {
    if (!selectedExam) return;
    setIsLoading(true);
    try {
      await assignExam(selectedExam._id, {
        teacherIds: selectedTeachers,
        studentIds: selectedStudents,
      });
      setShowAssign(false);
      setSelectedTeachers([]);
      setSelectedStudents([]);
      await loadExams();
    } catch (error) {
      console.error("Error assigning exam:", error);
    }
    setIsLoading(false);
  };

  const handleViewAssigned = (exam) => {
    setSelectedExam(exam);
    setShowViewAssigned(true);
  };

  const handleRemove = async (userId, role) => {
    if (!window.confirm(`Are you sure you want to remove this ${role}?`)) return;
    
    setIsLoading(true);
    try {
      await removeAssignment({
        examId: selectedExam._id,
        userId,
        role,
      });
      await loadExams();
      const updatedExam = exams.find((ex) => ex._id === selectedExam._id);
      setSelectedExam(updatedExam);
    } catch (error) {
      console.error("Error removing assignment:", error);
    }
    setIsLoading(false);
  };

  const handleEditExam = async (exam) => {
    const newTitle = prompt("Enter new exam title", exam.title);
    const newSubject = prompt("Enter new subject", exam.subject);
    const newDate = prompt("Enter new date (YYYY-MM-DD)", exam.date?.substring(0, 10));

    if (!newTitle || !newSubject || !newDate) return alert("All fields required");

    setIsLoading(true);
    try {
      await updateExam(exam._id, {
        title: newTitle,
        subject: newSubject,
        date: newDate,
      });
      await loadExams();
    } catch (error) {
      console.error("Error updating exam:", error);
    }
    setIsLoading(false);
  };

  const handleDeleteExam = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    setIsLoading(true);
    try {
      await deleteExam(id);
      await loadExams();
    } catch (error) {
      console.error("Error deleting exam:", error);
    }
    setIsLoading(false);
  };

  // Filter exams based on search and status
  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "published" && exam.isPublished) ||
                         (statusFilter === "unpublished" && !exam.isPublished);
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (isPublished) => {
    return isPublished ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <FiCheckCircle className="w-3 h-3 mr-1" />
        Published
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <FiClock className="w-3 h-3 mr-1" />
        Draft
      </span>
    );
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
                <FiBook className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Exam Management</h1>
                <p className="text-slate-600 mt-1">Create and manage examinations</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <FiPlus className="w-5 h-5" />
              <span>Create Exam</span>
            </button>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search exams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-64"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="unpublished">Draft</option>
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={loadExams}
                  className="flex items-center space-x-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors duration-200"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Create Exam Form */}
          {showCreateForm && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">Create New Exam</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <form onSubmit={handleCreateExam} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
                    <FiBook className="w-4 h-4" />
                    <span>Exam Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter exam title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
                    <FiBook className="w-4 h-4" />
                    <span>Subject</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
                    <FiCalendar className="w-4 h-4" />
                    <span>Exam Date</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div className="lg:col-span-3 flex space-x-3 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </div>
                    ) : (
                      "Create Exam"
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Exams Table */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-gray-50 to-blue-50/30">
              <h2 className="text-xl font-bold text-slate-800">All Exams</h2>
              <p className="text-slate-600 mt-1">
                {filteredExams.length} of {exams.length} exams
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredExams.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiBook className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No exams found</h3>
                <p className="text-slate-500 mb-6">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your search criteria" 
                    : "Create your first exam to get started"
                  }
                </p>
                {(searchTerm || statusFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
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
                      <th className="p-4 text-left text-sm font-semibold text-slate-700">Exam Title</th>
                      <th className="p-4 text-left text-sm font-semibold text-slate-700">Subject</th>
                      <th className="p-4 text-left text-sm font-semibold text-slate-700">Date</th>
                      <th className="p-4 text-center text-sm font-semibold text-slate-700">Status</th>
                      <th className="p-4 text-center text-sm font-semibold text-slate-700">Assigned</th>
                      <th className="p-4 text-right text-sm font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredExams.map((exam) => (
                      <tr key={exam._id} className="hover:bg-blue-50/30 transition-all duration-200">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                              <FiBook className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{exam.title}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {exam.subject || "-"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2 text-slate-700">
                            <FiCalendar className="w-4 h-4 text-slate-400" />
                            <span>{exam.date ? exam.date.substring(0, 10) : "-"}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          {getStatusBadge(exam.isPublished)}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-4">
                            <div className="flex items-center space-x-1 text-sm text-slate-600">
                              <FiUser className="w-4 h-4" />
                              <span>{exam.teacherIds?.length || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-slate-600">
                              <FiUsers className="w-4 h-4" />
                              <span>{exam.studentIds?.length || 0}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewAssigned(exam)}
                              className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors duration-200"
                              title="View Assigned"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => handleOpenAssign(exam)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                              title="Assign"
                            >
                              <FiUsers className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleEditExam(exam)}
                              className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors duration-200"
                              title="Edit"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteExam(exam._id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                              title="Delete"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleTogglePublish(exam._id)}
                              className={`p-2 rounded-lg transition-colors duration-200 ${
                                exam.isPublished 
                                  ? "text-red-600 hover:bg-red-100" 
                                  : "text-green-600 hover:bg-green-100"
                              }`}
                              title={exam.isPublished ? "Unpublish" : "Publish"}
                            >
                              {exam.isPublished ? <FiArchive className="w-4 h-4" /> : <FiSend className="w-4 h-4" />}
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

      {/* View Assigned Modal */}
      {showViewAssigned && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Assigned Lists for "{selectedExam.title}"
              </h2>
              <button
                onClick={() => setShowViewAssigned(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Teachers */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-3 text-blue-700 flex items-center space-x-2">
                  <FiUser className="w-5 h-5" />
                  <span>Teachers ({selectedExam.teacherIds?.length || 0})</span>
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedExam.teacherIds?.length > 0 ? (
                    selectedExam.teacherIds.map((t) => (
                      <div
                        key={t._id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200"
                      >
                        <div>
                          <p className="font-medium text-slate-800">{t.name}</p>
                          <p className="text-sm text-slate-600">{t.subject}</p>
                        </div>
                        <button
                          onClick={() => handleRemove(t._id, "teacher")}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors duration-200"
                          title="Remove"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-slate-500">
                      <FiUser className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No teachers assigned</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Students */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-3 text-green-700 flex items-center space-x-2">
                  <FiUsers className="w-5 h-5" />
                  <span>Students ({selectedExam.studentIds?.length || 0})</span>
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedExam.studentIds?.length > 0 ? (
                    selectedExam.studentIds.map((s) => (
                      <div
                        key={s._id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200"
                      >
                        <div>
                          <p className="font-medium text-slate-800">{s.name}</p>
                          <p className="text-sm text-slate-600">
                            {s.rollNo} • {s.department}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemove(s._id, "student")}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors duration-200"
                          title="Remove"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-slate-500">
                      <FiUsers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No students assigned</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowViewAssigned(false)}
                className="bg-slate-500 text-white px-6 py-2 rounded-xl hover:bg-slate-600 transition-colors duration-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Assign Teachers & Students to "{selectedExam?.title}"
              </h2>
              <button
                onClick={() => setShowAssign(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Teachers */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-3 text-blue-700">Teachers</h3>
                
                <div className="relative mb-3">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search teachers..."
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  ) : teachers
                    .filter((t) =>
                      t.name.toLowerCase().includes(teacherSearch.toLowerCase())
                    )
                    .map((t) => (
                      <label
                        key={t._id}
                        className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors duration-150"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          value={t._id}
                          checked={selectedTeachers.includes(t._id)}
                          onChange={(e) => {
                            if (e.target.checked)
                              setSelectedTeachers((prev) => [...prev, t._id]);
                            else
                              setSelectedTeachers((prev) =>
                                prev.filter((id) => id !== t._id)
                              );
                          }}
                        />
                        <div>
                          <p className="font-medium text-slate-800">{t.name}</p>
                          <p className="text-sm text-slate-600">{t.subject}</p>
                        </div>
                      </label>
                    ))}
                </div>
              </div>

              {/* Students */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-3 text-green-700">Students</h3>
                
                <div className="relative mb-3">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                    </div>
                  ) : students
                    .filter((s) =>
                      s.rollNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
                      s.name.toLowerCase().includes(studentSearch.toLowerCase())
                    )
                    .map((s) => (
                      <label
                        key={s._id}
                        className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-green-200 cursor-pointer hover:bg-green-50 transition-colors duration-150"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-green-600 focus:ring-green-500"
                          value={s._id}
                          checked={selectedStudents.includes(s._id)}
                          onChange={(e) => {
                            if (e.target.checked)
                              setSelectedStudents((prev) => [...prev, s._id]);
                            else
                              setSelectedStudents((prev) =>
                                prev.filter((id) => id !== s._id)
                              );
                          }}
                        />
                        <div>
                          <p className="font-medium text-slate-800">{s.name}</p>
                          <p className="text-sm text-slate-600">
                            {s.rollNo} • {s.department}
                          </p>
                        </div>
                      </label>
                    ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAssign(false)}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save Assignment"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}