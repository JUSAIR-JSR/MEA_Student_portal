import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { getExamStudents, saveResult, deleteResult } from "../api/api";

export default function ExamDetails() {
  const { examId } = useParams();
  const [examTitle, setExamTitle] = useState("");
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [marks, setMarks] = useState({});
  const [grades, setGrades] = useState({});

  useEffect(() => {
    loadExamData();
  }, []);

  const loadExamData = async () => {
    const res = await getExamStudents(examId);
    setExamTitle(res.data.examTitle);
    setStudents(res.data.students);
  };

  const handleSave = async (studentId) => {
    try {
      const gradeValue = grades[studentId] || "N/A"; // ✅ fallback
      const data = {
        studentId,
        marks: marks[studentId],
        grade: gradeValue,
      };
      await saveResult(examId, data);
      alert("✅ Result saved successfully");
      setEditingId(null);
      loadExamData();
    } catch (err) {
      alert("❌ Failed to save result");
    }
  };

  const handleDelete = async (resultId) => {
    if (!window.confirm("Are you sure to delete this result?")) return;
    await deleteResult(resultId);
    loadExamData();
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Manage Results for: {examTitle}
        </h2>

        <table className="w-full border-collapse bg-white rounded-xl shadow">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 text-left">Student Name</th>
              <th className="p-3 text-left">Roll No</th>
              <th className="p-3 text-center">Marks</th>
              <th className="p-3 text-center">Grade</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.rollNo}</td>
                <td className="p-3 text-center">
                  {editingId === s._id ? (
                    <input
                      type="number"
                      value={marks[s._id] ?? s.marks ?? ""}
                      onChange={(e) =>
                        setMarks({ ...marks, [s._id]: e.target.value })
                      }
                      className="border p-1 rounded w-20 text-center"
                    />
                  ) : (
                    s.marks || "-"
                  )}
                </td>
                <td className="p-3 text-center">
                  {editingId === s._id ? (
                    <input
                      type="text"
                      value={grades[s._id] ?? s.grade ?? ""}
                      onChange={(e) =>
                        setGrades({ ...grades, [s._id]: e.target.value })
                      }
                      className="border p-1 rounded w-20 text-center"
                    />
                  ) : (
                    s.grade || "-"
                  )}
                </td>
                <td className="p-3 text-center space-x-2">
                  {editingId === s._id ? (
                    <>
                      <button
                        onClick={() => handleSave(s._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingId(s._id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      {s.resultId && (
                        <button
                          onClick={() => handleDelete(s.resultId)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
