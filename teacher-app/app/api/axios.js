"use client";

import axios from "axios";

const API = axios.create({
    // baseURL: "http://localhost:5000/api",
  baseURL: "https://api.middleeastacademy.in/api",
  withCredentials: true,
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
export const getExamStudents = (id) => API.get(`/exam/${id}/students`);
export const saveResult = (id, data) => API.post(`/result/${id}`, data);
export const deleteResult = (id) => API.delete(`/result/${id}`);
export const logout = () => API.post("/auth/logout");

export default API;
