import { useEffect, useState } from "react";
import { getStudentResults } from "../api/api";

export default function StudentResults() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    const res = await getStudentResults();
    setResults(res.data);
  };

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Results</h1>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 text-left">Exam</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Teacher</th>
                <th className="p-3 text-center">Marks</th>
                <th className="p-3 text-center">Grade</th>
              </tr>
            </thead>
            <tbody>
              {results.length > 0 ? (
                results.map((r) => (
                  <tr key={r._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{r.examId?.title || "-"}</td>
                    <td className="p-3">{r.subject || "-"}</td>
                    <td className="p-3">
                      {r.examId?.date
                        ? new Date(r.examId.date).toLocaleDateString("en-IN")
                        : "-"}
                    </td>
                    <td className="p-3">
                      {r.teacherId?.name || "-"} ({r.teacherId?.subject || "-"})
                    </td>
                    <td className="p-3 text-center">{r.marks ?? "-"}</td>
                    <td className="p-3 text-center">{r.grade || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No results found.
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
