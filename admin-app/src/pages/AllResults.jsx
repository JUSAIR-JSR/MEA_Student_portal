import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAllResultsDetailed,deleteResult  } from "../api/api";

export default function AllResults() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const res = await getAllResultsDetailed();
      setResults(res.data);
    } catch (err) {
      console.error("❌ Failed to load results:", err);
    }
  };
  // 🗑️ Delete a specific result
const handleDeleteResult = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this result permanently?");
  if (!confirmDelete) return;

  try {
    await deleteResult(id);
    alert("✅ Result deleted successfully!");
    loadResults(); // refresh
  } catch (error) {
    console.error("❌ Failed to delete result:", error);
    alert("Error deleting result!");
  }
};

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">All Student Results</h1>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 text-left">Student</th>
                <th className="p-3 text-left">Roll No</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Exam</th>
                <th className="p-3 text-left">Date</th> 
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-center">Marks</th>
                <th className="p-3 text-center">Grade</th>
                <th className="p-3 text-left">Teacher</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.length > 0 ? (
                results.map((r) => (
                  <tr
                    key={r._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{r.studentId?.name || "-"}</td>
                    <td className="p-3">{r.studentId?.rollNo || "-"}</td>
                    <td className="p-3">{r.studentId?.email || "-"}</td>
                    <td className="p-3">{r.studentId?.department || "-"}</td>
                    <td className="p-3">{r.examId?.title || "-"}</td>
                    <td className="p-3">{formatDate(r.examId?.date)}</td> {/* ✅ Added */}
                    <td className="p-3">{r.subject || "-"}</td>
                    <td className="p-3 text-center">{r.marks ?? "-"}</td>
                    <td className="p-3 text-center">{r.grade || "-"}</td>
                    <td className="p-3">
                      {r.teacherId?.name || "-"} ({r.teacherId?.subject || "-"})
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDeleteResult(r._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="p-4 text-center text-gray-500">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
