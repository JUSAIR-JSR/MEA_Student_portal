import axios from "axios";

const API = axios.create({
    // baseURL: "http://localhost:5000/api",
  baseURL: "https://api.middleeastacademy.in/api",
  withCredentials: true,
});

export const studentLogin = (data) => API.post("/auth/login", data);

export const getStudentExams = () => API.get("/student/assigned-exams");
export const getStudentResults = () => API.get("/student/my-results");
export const getStudentProfile = () => API.get("/student/profile");
export const getStudentNotifications = () =>
  API.get("/notifications/published/all");

export const logout = () => API.post("/auth/logout");

export default API;
