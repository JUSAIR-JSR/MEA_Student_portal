import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://api.middleeastacademy.in/api",
  withCredentials: true, // 🔥 Send HttpOnly cookies in every request
});

// ❌ Remove all localStorage token usage (NO tokens now)
API.interceptors.request.use((config) => {
  return config; // nothing to attach
});

// Auto logout if cookie expired
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

// ---------------- ADMIN AUTH ----------------
export const adminLogin = (data) => API.post("/auth/login", data);
export const adminLogout = () => API.post("/auth/logout");
export const getMe = () => API.get("/auth/me");
export const googleAuth = (data) => API.post("/auth/google", data);
// ---------------- TEACHER OPS ----------------
export const createTeacher = (data) => API.post("/admin/create-teacher", data);
export const getTeachers = () => API.get("/admin/teachers");
export const deleteTeacher = (id) => API.delete(`/admin/delete-teacher/${id}`);
export const updateTeacher = (id, data) =>
  API.put(`/admin/update-teacher/${id}`, data);
export const resetTeacherPassword = (id, newPassword) =>
  API.put(`/admin/reset-password`, { role: "teacher", id, newPassword });

// ---------------- STUDENT OPS ----------------
export const createStudent = (data) => API.post("/admin/create-student", data);
export const getStudents = () => API.get("/admin/students");
export const deleteStudent = (id) => API.delete(`/admin/delete-student/${id}`);
export const updateStudent = (id, data) =>
  API.put(`/admin/update-student/${id}`, data);
export const resetStudentPassword = (id, newPassword) =>
  API.put(`/admin/reset-password`, { role: "student", id, newPassword });

// ---------------- EXAMS ----------------
export const getExams = () => API.get("/exam");
export const createExam = (data) => API.post("/exam/create", data);
export const updateExam = (id, data) => API.put(`/exam/update/${id}`, data);
export const deleteExam = (id) => API.delete(`/exam/delete/${id}`);
export const togglePublish = (id) => API.put(`/exam/publish/${id}`);
export const assignExam = (id, data) => API.put(`/exam/assign/${id}`, data);
export const removeAssignment = (data) =>
  API.put("/exam/remove-assignment", data);

// ---------------- RESULTS ----------------
export const getAllResultsDetailed = () => API.get("/admin/all-results");
export const deleteResult = (id) => API.delete(`/admin/delete-result/${id}`);

// ---------------- NOTIFICATIONS ----------------
export const getAllNotifications = () => API.get("/notifications");
export const createNotification = (data) => API.post("/notifications", data);
export const updateNotification = (id, data) =>
  API.put(`/notifications/${id}`, data);
export const deleteNotification = (id) =>
  API.delete(`/notifications/${id}`);
export const toggleNotification = (id) =>
  API.put(`/notifications/toggle/${id}`);
export const getPublishedNotifications = () =>
  API.get("/notifications/published/all");

// ---------------- ANALYTICS ----------------
export const getOverviewStats = () => API.get("/admin/stats/overview");
export const getPassFailStats = () => API.get("/admin/stats/passfail");
export const getSubjectAverages = () =>
  API.get("/admin/stats/subject-average");

export const getDepartmentPerformance = () =>
  API.get("/admin/stats/department-performance");

export const getTopPerformers = () =>
  API.get("/admin/stats/top-performers");

export const getMonthlyTrends = () =>
  API.get("/admin/stats/monthly-trends");

export const getRecentActivity = () =>
  API.get("/admin/stats/recent-activity");

export default API;
