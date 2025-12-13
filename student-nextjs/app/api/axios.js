import axios from "axios";

const API = axios.create({
  baseURL: "https://api.middleeastacademy.in/api",
  withCredentials: true, // REQUIRED FOR HTTP-ONLY COOKIES
});

// Auto redirect to login if cookie expired
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.replace("/login");
    }
    return Promise.reject(err);
  }
);


// ---------- AUTH ----------
export const studentLogin = (data) => API.post("/auth/login", data);
export const logout = () => API.post("/auth/logout");

// ---------- STUDENT DATA ----------
export const getStudentProfile = () => API.get("/student/profile");
export const getStudentExams = () => API.get("/student/assigned-exams");
export const getStudentResults = () => API.get("/student/my-results");

// ---------- ⭐ FIXED EXPORT (VERCEL BUILD ERROR) ----------
export const getStudentNotifications = () =>
  API.get("/student/notifications");

export default API;
