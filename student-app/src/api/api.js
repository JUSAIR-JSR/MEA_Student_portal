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

// ✅ Student login using roll number
export const studentLogin = (data) => API.post("/auth/login", data);

// ✅ Student APIs
export const getStudentExams = () => API.get("/student/assigned-exams");
export const getStudentResults = () => API.get("/student/my-results");
// student profile
export const getStudentProfile = () => API.get("/student/profile");
//notification show
export const getStudentNotifications = () => API.get("/notifications/published/all");



export default API;
