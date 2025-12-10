import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import {
  getStudents,
  createStudent,
  deleteStudent,
  updateStudent,
  resetStudentPassword,
} from "../api/api";

// Import icons
import {
  FiUserPlus,
  FiUsers,
  FiUser,
  FiMail,
  FiLock,
  FiBook,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiEdit2,
  FiTrash2,
  FiKey,
  FiX,
  FiAward,
  FiHash,
  FiBriefcase,
  FiBarChart2
} from "react-icons/fi";

export default function StudentManager() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    rollNo: "", 
    department: "" 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [editId, setEditId] = useState(null);

  // Get unique departments for filter
  const departments = [...new Set(students.map(student => student.department).filter(Boolean))];

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const res = await getStudents();
      setStudents(res.data);
    } catch (error) {
      console.error("Error loading students:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim() || 
        !form.rollNo.trim() || !form.department.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      if (editId) {
        await updateStudent(editId, form);
        setEditId(null);
      } else {
        await createStudent(form);
      }
      setForm({ name: "", email: "", password: "", rollNo: "", department: "" });
      setShowForm(false);
      await loadStudents();
    } catch (error) {
      console.error("Error saving student:", error);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    setIsLoading(true);
    try {
      await deleteStudent(id);
      await loadStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
    setIsLoading(false);
  };

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      password: "", // Don't pre-fill password for security
      rollNo: student.rollNo,
      department: student.department
    });
    setEditId(student._id);
    setShowForm(true);
  };

  const handleReset = async (student) => {
    const newPassword = prompt("Enter new password for " + student.name);
    if (!newPassword) return;
    
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      await resetStudentPassword(student._id, newPassword);
      alert("✅ Password reset successfully for " + student.name);
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("❌ Error resetting password");
    }
    setIsLoading(false);
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({ name: "", email: "", password: "", rollNo: "", department: "" });
    setShowForm(false);
  };

  // Filter students based on search and department
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || student.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  // Statistics calculations
  const totalStudents = students.length;
  const departmentsCount = departments.length;
  const filteredCount = filteredStudents.length;
  const recentStudents = students.filter(s => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return new Date(s.createdAt) > monthAgo;
  }).length;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <FiUsers className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Student Management</h1>
                <p className="text-slate-600 mt-1">Manage student records and enrollments</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <FiUserPlus className="w-5 h-5" />
              <span>Add Student</span>
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Students</p>
                  <p className="text-2xl font-bold mt-1">{totalStudents}</p>
                </div>
                <FiUsers className="w-8 h-8 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Departments</p>
                  <p className="text-2xl font-bold mt-1">{departmentsCount}</p>
                </div>
                <FiBriefcase className="w-8 h-8 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Filtered</p>
                  <p className="text-2xl font-bold mt-1">{filteredCount}</p>
                </div>
                <FiFilter className="w-8 h-8 text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">This Month</p>
                  <p className="text-2xl font-bold mt-1">{recentStudents}</p>
                </div>
                <FiAward className="w-8 h-8 text-amber-200" />
              </div>
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
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-64"
                  />
                </div>
                
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={loadStudents}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors duration-200 disabled:opacity-50"
                >
                  <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Create/Edit Student Form */}
          {showForm && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  {editId ? "Edit Student" : "Add New Student"}
                </h2>
                <button
                  onClick={cancelEdit}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
                    <FiUser className="w-4 h-4" />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter student's name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
                    <FiMail className="w-4 h-4" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
                    <FiHash className="w-4 h-4" />
                    <span>Roll Number</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter roll number"
                    value={form.rollNo}
                    onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
                    <FiBriefcase className="w-4 h-4" />
                    <span>Department</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter department"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
                    <FiLock className="w-4 h-4" />
                    <span>
                      Password
                      {!editId && <span className="text-red-500 ml-1">*</span>}
                    </span>
                  </label>
                  <input
                    type="password"
                    placeholder={editId ? "Leave blank to keep current" : "Enter password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required={!editId}
                    minLength="6"
                  />
                  {editId && (
                    <p className="text-xs text-slate-500 mt-1">
                      Leave password blank to keep current password
                    </p>
                  )}
                </div>

                <div className="lg:col-span-2 flex space-x-3 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{editId ? "Updating..." : "Creating..."}</span>
                      </div>
                    ) : editId ? (
                      "Update Student"
                    ) : (
                      "Add Student"
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Students Table */}
          <Table
            title="Student Records"
            columns={["Name", "Email", "RollNo", "Department", "Password"]}
            data={filteredStudents}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReset={handleReset}
            searchable={false} // We have our own search
            pagination={true}
            onCreate={() => setShowForm(true)}
            onExport={() => {
              // Export functionality can be implemented here
              alert("Export functionality would be implemented here");
            }}
          />

          {/* Department Distribution Chart (Visual) */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mt-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
              <FiBarChart2 className="w-5 h-5" />
              <span>Department Distribution</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {departments.slice(0, 8).map(dept => {
                const count = students.filter(s => s.department === dept).length;
                const percentage = totalStudents > 0 ? (count / totalStudents * 100).toFixed(1) : 0;
                return (
                  <div key={dept} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-slate-800 text-sm truncate">{dept}</span>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        {percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">{count} students</p>
                  </div>
                );
              })}
              {departments.length === 0 && (
                <div className="col-span-4 text-center py-4 text-slate-500">
                  <FiUsers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No department data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}