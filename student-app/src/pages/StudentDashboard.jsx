import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentNotifications, getStudentResults } from "../api/api";

export default function StudentDashboard() {
  const [notifications, setNotifications] = useState([]);
  const [latestResult, setLatestResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Fetch notifications & results in parallel
      const [notifRes, resultRes] = await Promise.all([
        getStudentNotifications(),
        getStudentResults(),
      ]);

        
      setNotifications(notifRes.data);

      // ✅ Pick only the latest result (based on date)
      if (resultRes.data && resultRes.data.length > 0) {
        const sorted = [...resultRes.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setLatestResult(sorted[0]);
      }
    } catch (error) {
      console.error("Failed to load student dashboard:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Welcome, Student 👋</h2>

      {/* 🔔 Notifications Section */}
      {notifications.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold text-yellow-700 mb-2">
            🔔 Upcoming Exams
          </h3>
          <ul className="list-disc pl-6">
            {notifications.map((exam) => (
              <li key={exam._id}>
                <span className="font-semibold">{exam.title}</span> —{" "}
                {exam.subject} on{"  "} {exam.message}
                {/* <span className="text-blue-600">
                  {new Date(exam.expiryDate).toLocaleDateString("en-IN")}
                </span> */}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 🏆 Latest Result */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h3 className="text-xl font-semibold text-green-700 mb-4">
          🏆 Latest Result
        </h3>

        {latestResult ? (
          <div className="grid grid-cols-2 gap-3 text-gray-800">
            <p>
              <strong>Exam:</strong> {latestResult.examId?.title || "-"}
            </p>
            <p>
              <strong>Subject:</strong> {latestResult.subject || "-"}
            </p>
            <p>
              <strong>Marks:</strong> {latestResult.marks ?? "-"}
            </p>
            <p>
              <strong>Grade:</strong> {latestResult.grade || "-"}
            </p>
            <p className="col-span-2 text-sm text-gray-500">
              <strong>Date:</strong>{" "}
              {new Date(latestResult.createdAt).toLocaleDateString("en-IN")}
            </p>
          </div>
        ) : (
          <p className="text-gray-500 italic">No results available yet.</p>
        )}
      </div>

      {/* 📄 My Results Button */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/student-results")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 shadow-md"
        >
          View My Results
        </button>
      </div>
    </div>
  );
}
