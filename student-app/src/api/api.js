// src/api/api.js
import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://api.middleeastacademy.in/api",
  withCredentials: true, // 🔥 send cookies automatically
});

// No Authorization header
API.interceptors.request.use((config) => {
  return config; // clean, secure
});

// No auto logout based on token
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

// ------------- AUTH ------------------
export const studentLogin = (data) => API.post("/auth/login", data);

// ------------- STUDENT ---------------
export const getStudentExams = () => API.get("/student/assigned-exams");
export const getStudentResults = () => API.get("/student/my-results");
export const getStudentProfile = () => API.get("/student/profile");
export const getStudentNotifications = () =>
  API.get("/notifications/published/all");

export default API;
