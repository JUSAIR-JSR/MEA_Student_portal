// src/pages/AdminAnalytics.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // your admin navbar
import {
  getOverviewStats,
  getPassFailStats,
  getSubjectAverages,
} from "../api/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = ["#4CAF50", "#FF5722", "#2196F3", "#FFC107", "#9C27B0"];

export default function AdminAnalytics() {
  const [overview, setOverview] = useState(null);
  const [passFail, setPassFail] = useState(null);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [ov, pf, sa] = await Promise.all([
        getOverviewStats(),
        getPassFailStats(),
        getSubjectAverages(),
      ]);
      setOverview(ov.data);
      setPassFail(pf.data);
      setSubjects(sa.data);
    } catch (err) {
      console.error("Failed to load analytics", err);
    }
  };

  const pieData = passFail
    ? [
        { name: "Passed", value: passFail.passed },
        { name: "Failed", value: passFail.failed },
      ]
    : [];

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Admin Analytics</h2>

        {/* Overview cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Students</div>
            <div className="text-2xl font-bold">{overview?.students ?? "—"}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Teachers</div>
            <div className="text-2xl font-bold">{overview?.teachers ?? "—"}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Exams</div>
            <div className="text-2xl font-bold">{overview?.exams ?? "—"}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Results</div>
            <div className="text-2xl font-bold">{overview?.results ?? "—"}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Pass/Fail Pie */}
          <div className="col-span-1 bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Pass / Fail</h3>
            {passFail ? (
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="mt-3 text-sm text-gray-600">
                  <div>Pass mark: {passFail.passMark || 35}</div>
                  <div>Passed: {passFail.passed} ({passFail.passPercent}%)</div>
                  <div>Failed: {passFail.failed} ({passFail.failPercent}%)</div>
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>

          {/* Subject averages Bar */}
          <div className="col-span-2 bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Subject-wise Average Marks</h3>
            {subjects?.length > 0 ? (
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={subjects}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgMarks" name="Average Marks" fill="#4CAF50" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p>No subject data</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
