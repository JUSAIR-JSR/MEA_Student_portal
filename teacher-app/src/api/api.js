import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://middleeastacademyserver.onrender.com/api",
  withCredentials: true,   // REQUIRED for cookies
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export const teacherLogin = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

export const getAssignedExams = () => API.get("/exam/assigned");
export const getExamStudents = (examId) => API.get(`/exam/${examId}/students`);
export const saveResult = (examId, data) => API.post(`/result/${examId}`, data);
export const deleteResult = (resultId) => API.delete(`/result/${resultId}`);

export const logout = () => API.post("/auth/logout");

export default API;
