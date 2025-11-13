// src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token for every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto logout if token invalid
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

// Admin APIs
export const adminLogin = (data) => API.post("/auth/login", data);
export const createTeacher = (data) => API.post("/admin/create-teacher", data);
export const createStudent = (data) => API.post("/admin/create-student", data);
export const getExams = () => API.get("/exam");
export const createExam = (data) => API.post("/exam/create", data);
export const togglePublish = (id) => API.put(`/exam/publish/${id}`);
export const assignExam = (id, data) => API.put(`/exam/assign/${id}`, data);
export const removeAssignment = (data) => API.put("/exam/remove-assignment", data);

// Teacher APIs
export const getTeachers = () => API.get("/admin/teachers"); // We'll create this in backend next
export const deleteTeacher = (id) => API.delete(`/admin/delete-teacher/${id}`);
export const updateTeacher = (id, data) =>
  API.put(`/admin/update-teacher/${id}`, data);
export const resetTeacherPassword = (id, newPassword) =>
  API.put(`/admin/reset-password`, { role: "teacher", id, newPassword });

// Student APIs
export const getStudents = () => API.get("/admin/students");
export const deleteStudent = (id) => API.delete(`/admin/delete-student/${id}`);
export const updateStudent = (id, data) =>
  API.put(`/admin/update-student/${id}`, data);
export const resetStudentPassword = (id, newPassword) =>
  API.put(`/admin/reset-password`, { role: "student", id, newPassword });

// ✅ Get all detailed results
export const getAllResultsDetailed = () => API.get("/admin/all-results");
// Delete result by ID
export const deleteResult = (id) => API.delete(`/admin/delete-result/${id}`);

// Update exam
export const updateExam = (id, data) => API.put(`/exam/update/${id}`, data);

// Delete exam
export const deleteExam = (id) => API.delete(`/exam/delete/${id}`);


// 🔔 Notifications API
export const getAllNotifications = () => API.get("/notifications");
export const createNotification = (data) => API.post("/notifications", data);
export const updateNotification = (id, data) => API.put(`/notifications/${id}`, data);
export const deleteNotification = (id) => API.delete(`/notifications/${id}`);
export const toggleNotification = (id) => API.put(`/notifications/toggle/${id}`);
export const getPublishedNotifications = () => API.get("/notifications/published/all");

//google auth api for admin
export const googleAuth = (data) => API.post("/auth/google", data);


// analaytics data for admin
export const getOverviewStats = () => API.get("/admin/stats/overview");
export const getPassFailStats = () => API.get("/admin/stats/passfail");
export const getSubjectAverages = () => API.get("/admin/stats/subject-average");



export default API;
