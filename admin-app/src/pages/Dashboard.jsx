import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getExams,
  createExam,
  togglePublish,
  getTeachers,
  getStudents,
  assignExam,
  removeAssignment,
    updateExam,
  deleteExam,
} from "../api/api";

export default function Dashboard() {
  const [exams, setExams] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [subject, setSubject] = useState("");
  

  const [showAssign, setShowAssign] = useState(false);
  const [showViewAssigned, setShowViewAssigned] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

const [teacherSearch, setTeacherSearch] = useState("");
const [studentSearch, setStudentSearch] = useState("");

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    const res = await getExams();
    setExams(res.data);
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim() || !date) {
      alert("Please fill in all fields");
      return;
    }

    await createExam({ title, subject, date });
    setTitle("");
    setDate("");
    setSubject("");
    loadExams();
  };

  const handleTogglePublish = async (id) => {
    await togglePublish(id);
    loadExams();
  };

  // 🧩 Open Assign Modal
  const handleOpenAssign = async (exam) => {
    setSelectedExam(exam);
    setShowAssign(true);
    const tRes = await getTeachers();
    const sRes = await getStudents();
    setTeachers(tRes.data);
    setStudents(sRes.data);

    // Pre-fill with already assigned IDs
    setSelectedTeachers(exam.teacherIds.map((t) => t._id));
    setSelectedStudents(exam.studentIds.map((s) => s._id));
  };

  // 🧩 Save Assignment Changes
  const handleAssign = async () => {
    if (!selectedExam) return;
    await assignExam(selectedExam._id, {
      teacherIds: selectedTeachers,
      studentIds: selectedStudents,
    });
    alert("✅ Assignment updated successfully!");
    setShowAssign(false);
    setSelectedTeachers([]);
    setSelectedStudents([]);
    loadExams();
  };

  // 👁️ View Assigned Modal
  const handleViewAssigned = (exam) => {
    setSelectedExam(exam);
    setShowViewAssigned(true);
  };

  // ❌ Remove assignment
  const handleRemove = async (userId, role) => {
    await removeAssignment({
      examId: selectedExam._id,
      userId,
      role,
    });
    alert("❌ Removed successfully!");
    loadExams();
    // Refresh modal content
    const updatedExam = exams.find((ex) => ex._id === selectedExam._id);
    setSelectedExam(updatedExam);
  };


  // ✏️ Edit Exam
const handleEditExam = async (exam) => {
  const newTitle = prompt("Enter new exam title", exam.title);
  const newSubject = prompt("Enter new subject", exam.subject);
  const newDate = prompt("Enter new date (YYYY-MM-DD)", exam.date?.substring(0, 10));

  if (!newTitle || !newSubject || !newDate) return alert("All fields required");

  await updateExam(exam._id, {
    title: newTitle,
    subject: newSubject,
    date: newDate,
  });

  alert("✅ Exam updated successfully!");
  loadExams();
};

// 🗑️ Delete Exam
const handleDeleteExam = async (id) => {
  if (!window.confirm("Are you sure you want to delete this exam?")) return;
  await deleteExam(id);
  alert("🗑️ Exam deleted successfully!");
  loadExams();
};


  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Exam Management</h2>

        {/* ✅ Create Exam Form */}
        <form
          onSubmit={handleCreateExam}
          className="flex gap-2 mb-6 flex-wrap items-center"
        >
          <input
            type="text"
            placeholder="Exam Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded w-1/4"
            required
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border p-2 rounded w-1/4"
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded w-1/4"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create Exam
          </button>
        </form>

        {/* ✅ Exam Table */}
        <table className="w-full border-collapse bg-white rounded-xl shadow">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Subject</th> {/* ✅ Added */}
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{exam.title}</td>
                <td className="p-3">{exam.subject || "-"}</td> {/* ✅ Added */}
                <td className="p-3">
                  {exam.date ? exam.date.substring(0, 10) : "-"}
                </td>
                <td className="p-3 text-center">
                  {exam.isPublished ? (
                    <span className="text-green-600 font-semibold">
                      Published
                    </span>
                  ) : (
                    <span className="text-gray-600">Unpublished</span>
                  )}
                </td>
                <td className="p-3 text-center space-x-2">
  <button
    onClick={() => handleViewAssigned(exam)}
    className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
  >
    View Assigned
  </button>

  <button
    onClick={() => handleOpenAssign(exam)}
    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
  >
    Assign
  </button>

  <button
    onClick={() => handleEditExam(exam)}
    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
  >
    Edit
  </button>

  <button
    onClick={() => handleDeleteExam(exam._id)}
    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
  >
    Delete
  </button>

  <button
    onClick={() => handleTogglePublish(exam._id)}
    className={`px-3 py-1 rounded text-white ${
      exam.isPublished ? "bg-red-500" : "bg-green-600"
    }`}
  >
    {exam.isPublished ? "Unpublish" : "Publish"}
  </button>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 👁️ View Assigned Modal */}
      {showViewAssigned && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-2/3 max-h-[90vh] overflow-y-auto shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Assigned Lists for "{selectedExam.title}"
            </h2>

            <div className="grid grid-cols-2 gap-6">
              {/* Teachers */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-blue-600">
                  Teachers
                </h3>
                <div className="border rounded-lg p-3 max-h-60 overflow-y-auto">
                  {selectedExam.teacherIds?.length > 0 ? (
                    selectedExam.teacherIds.map((t) => (
                      <div
                        key={t._id}
                        className="flex justify-between border-b py-1"
                      >
                        <span>
                          {t.name} ({t.subject})
                        </span>
                        <button
                          onClick={() => handleRemove(t._id, "teacher")}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No teachers assigned</p>
                  )}
                </div>
              </div>

              {/* Students */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-green-600">
                  Students
                </h3>
                <div className="border rounded-lg p-3 max-h-60 overflow-y-auto">
                  {selectedExam.studentIds?.length > 0 ? (
                    selectedExam.studentIds.map((s) => (
                      <div
                        key={s._id}
                        className="flex justify-between border-b py-1"
                      >
                        <span>
                          {s.name} ({s.rollNo}) — {s.department}
                        </span>
                        <button
                          onClick={() => handleRemove(s._id, "student")}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No students assigned</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowViewAssigned(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

     {/* 🧩 Assign Modal */}
{showAssign && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-xl p-6 w-2/3 max-h-[90vh] overflow-y-auto shadow-lg">
      <h2 className="text-xl font-semibold mb-4">
        Assign Teachers & Students to "{selectedExam?.title}"
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {/* ---------------- TEACHERS ---------------- */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Teachers</h3>

          {/* 🔍 Teacher Search Bar */}
          <input
            type="text"
            placeholder="Search teacher by name..."
            className="border p-2 w-full rounded mb-3"
            value={teacherSearch}
            onChange={(e) => setTeacherSearch(e.target.value)}
          />

          <div className="border rounded-lg p-3 max-h-60 overflow-y-auto">
            {teachers
              .filter((t) =>
                t.name.toLowerCase().includes(teacherSearch.toLowerCase())
              )
              .map((t) => (
                <label key={t._id} className="block mb-1">
                  <input
                    type="checkbox"
                    className="mr-2"
                    value={t._id}
                    checked={selectedTeachers.includes(t._id)}
                    onChange={(e) => {
                      if (e.target.checked)
                        setSelectedTeachers((prev) => [...prev, t._id]);
                      else
                        setSelectedTeachers((prev) =>
                          prev.filter((id) => id !== t._id)
                        );
                    }}
                  />
                  {t.name} ({t.subject})
                </label>
              ))}
          </div>
        </div>

        {/* ---------------- STUDENTS ---------------- */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Students</h3>

          {/* 🔍 Student Search Bar */}
          <input
            type="text"
            placeholder="Search student by roll number..."
            className="border p-2 w-full rounded mb-3"
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
          />

          <div className="border rounded-lg p-3 max-h-60 overflow-y-auto">
            {students
              .filter((s) =>
                s.rollNo.toLowerCase().includes(studentSearch.toLowerCase())
              )
              .map((s) => (
                <label key={s._id} className="block mb-1">
                  <input
                    type="checkbox"
                    className="mr-2"
                    value={s._id}
                    checked={selectedStudents.includes(s._id)}
                    onChange={(e) => {
                      if (e.target.checked)
                        setSelectedStudents((prev) => [...prev, s._id]);
                      else
                        setSelectedStudents((prev) =>
                          prev.filter((id) => id !== s._id)
                        );
                    }}
                  />
                  {s.name} ({s.rollNo})
                </label>
              ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <button
          onClick={() => setShowAssign(false)}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={handleAssign}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Assignment
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
}
