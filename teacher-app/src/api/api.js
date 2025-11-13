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

// ✅ Fetch all exams assigned to the logged-in teacher
export const getAssignedExams = () => API.get("/exam/assigned");

// ✅ Fetch students and their results for a specific exam
export const getExamStudents = (examId) => API.get(`/exam/${examId}/students`);

// ✅ Save or update result
export const saveResult = (examId, data) => API.post(`/result/${examId}`, data);

// ✅ Delete a result
export const deleteResult = (resultId) => API.delete(`/result/${resultId}`);


// teacher login
export const teacherLogin = (data) => API.post("/auth/login", data);

export default API;
