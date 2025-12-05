import axios from "axios";

const API = axios.create({
  baseURL: "https://api.middleeastacademy.in/api",
  withCredentials: true,   // <-- MOST IMPORTANT
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const studentLogin = (data) => API.post("/auth/login", data);
export const getStudentResults = () => API.get("/student/my-results");
export const getStudentExams = () => API.get("/student/assigned-exams");
export const getStudentProfile = () => API.get("/student/profile");
export const logout = () => API.post("/auth/logout");
export default API;
