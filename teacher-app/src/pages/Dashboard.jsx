import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAssignedExams } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const res = await getAssignedExams();
      setExams(res.data);
    } catch (error) {
      console.error("Failed to load exams:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Assigned Exams</h2>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Subject</th> {/* ✅ Added */}
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-center">Published</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.length > 0 ? (
                exams.map((exam) => (
                  <tr
                    key={exam._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{exam.title}</td>
                    <td className="p-3">{exam.subject || "-"}</td> {/* ✅ Show subject */}
                    <td className="p-3">
                      {exam.date ? exam.date.substring(0, 10) : "-"}
                    </td>
                    <td className="p-3 text-center">
                      {exam.isPublished ? (
                        <span className="text-green-600 font-semibold">
                          Yes
                        </span>
                      ) : (
                        <span className="text-gray-500">No</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => navigate(`/exam/${exam._id}`)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Manage Results
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-4 text-center text-gray-500"
                  >
                    No assigned exams found
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
