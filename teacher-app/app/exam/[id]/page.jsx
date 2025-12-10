"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  getExamStudents,
  saveResult,
  deleteResult,
} from "../../api/axios";
import Toast from "@/components/Toast";
import {
  RefreshCw,
  Edit2,
  Save,
  X,
  Trash2,
  User,
} from "lucide-react";

export default function ExamDetails() {
  const { id } = useParams();

  const [examTitle, setExamTitle] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [savingMap, setSavingMap] = useState({});
  const [deletingMap, setDeletingMap] = useState({});

  const [editingId, setEditingId] = useState(null);
  const [marksInput, setMarksInput] = useState({});
  const [gradeInput, setGradeInput] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (id) loadExamData();
  }, [id]);

  async function loadExamData() {
    try {
      setLoading(true);
      const res = await getExamStudents(id);

      setExamTitle(res.data.examTitle || "Exam");

      const list = (res.data.students || []).map((s) => ({
        _id: s._id,
        name: s.name,
        rollNo: s.rollNo,
        marks: s.marks ?? null,
        grade: s.grade ?? null,
        resultId: s.resultId ?? null,
      }));
      setStudents(list);

      const marksMap = {};
      const gradeMap = {};
      list.forEach((s) => {
        marksMap[s._id] = s.marks ?? "";
        gradeMap[s._id] = s.grade ?? "";
      });

      setMarksInput(marksMap);
      setGradeInput(gradeMap);
    } catch (err) {
      showToast("error", "Failed to load exam data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    const total = students.length;
    const graded =
      students.filter(
        (s) =>
          (s.marks !== null && s.marks !== "") ||
          (s.grade && s.grade !== "N/A")
      ).length;
    const pending = total - graded;
    return { total, graded, pending };
  }, [students]);

  function showToast(type, message, timeout = 3000) {
    setToast({ type, message });
    setTimeout(() => setToast(null), timeout);
  }

  const startEdit = (student) => {
    setEditingId(student._id);
  };

  const cancelEdit = () => setEditingId(null);

  async function handleSave(studentId) {
    const marksValRaw = marksInput[studentId];
    const gradeValRaw = (gradeInput[studentId] || "").trim();

    const marksVal = marksValRaw === "" ? 0 : Number(marksValRaw);

    if (marksValRaw !== "" && (isNaN(marksVal) || marksVal < 0)) {
      return showToast("error", "Marks must be a valid non-negative number");
    }

    setSavingMap((m) => ({ ...m, [studentId]: true }));

    try {
      await saveResult(id, {
        studentId,
        marks: marksVal,
        grade: gradeValRaw || "N/A",
      });

      await loadExamData();
      setEditingId(null);
      showToast("success", "Saved successfully");
    } catch (err) {
      showToast("error", "Failed to save result");
    } finally {
      setSavingMap((m) => ({ ...m, [studentId]: false }));
    }
  }

  async function handleDelete(resultId) {
    if (!resultId) return;
    if (!confirm("Delete this result?")) return;

    setDeletingMap((m) => ({ ...m, [resultId]: true }));

    try {
      await deleteResult(resultId);
      await loadExamData();
      showToast("success", "Result deleted");
    } catch (err) {
      showToast("error", "Failed to delete result");
    } finally {
      setDeletingMap((m) => ({ ...m, [resultId]: false }));
    }
  }

  const marksColor = (m) => {
    if (m == null || m === "") return "text-slate-500";
    const n = Number(m);
    if (n >= 80) return "text-emerald-600";
    if (n >= 60) return "text-blue-600";
    if (n >= 40) return "text-amber-600";
    return "text-red-600";
  };

  const gradeBadge = (g) => {
    if (!g || g === "N/A")
      return "bg-slate-100 text-slate-700 border border-slate-200";
    return {
      "A+": "bg-emerald-100 text-emerald-700 border border-emerald-200",
      A: "bg-green-100 text-green-700 border border-green-200",
      "B+": "bg-blue-100 text-blue-700 border border-blue-200",
      B: "bg-sky-100 text-sky-700 border border-sky-200",
      C: "bg-amber-100 text-amber-700 border border-amber-200",
      D: "bg-orange-100 text-orange-700 border border-orange-200",
      F: "bg-red-100 text-red-700 border border-red-200",
    }[g] || "bg-slate-100 text-slate-800 border border-slate-200";
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-linear-to-br from-slate-50 to-white px-4 py-10 md:px-8">
        <div className="max-w-6xl mx-auto space-y-10">

          {/* HEADER CARD */}
          <div className="bg-white p-8 rounded-3xl shadow border border-slate-200 mt-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-extrabold bg-[linear-gradient(to_right,#3b82f6,#6366f1)] bg-clip-text text-transparent">
                  {examTitle}
                </h1>
                <p className="text-slate-500 mt-2">
                  Manage, edit & update student exam results.
                </p>
                <div className="mt-3 h-1 w-28 rounded-full bg-[linear-gradient(to_right,#3b82f6,#6366f1)]" />
              </div>

              <button
                onClick={loadExamData}
                disabled={loading}
                className="
                  flex items-center gap-2 px-5 py-3 rounded-xl
                  bg-[linear-gradient(to_right,#3b82f6,#6366f1)] text-white
                  shadow hover:shadow-lg transition active:scale-95
                  disabled:opacity-50
                "
              >
                <RefreshCw className={`${loading ? "animate-spin" : ""} w-5 h-5`} />
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatsCard title="Total Students" value={stats.total} color="slate" />
            <StatsCard title="Graded" value={stats.graded} color="emerald" />
            <StatsCard title="Pending" value={stats.pending} color="amber" />
          </div>

          {/* STUDENTS CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow">
            <div className="p-8 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Student Results</h2>
              <p className="text-slate-500 mt-1 text-sm">
                {students.length} student(s) assigned
              </p>
            </div>

            <div className="p-6">

              {/* LOADING */}
              {loading && (
                <div className="flex flex-col items-center py-16">
                  <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-blue-500 animate-spin"></div>
                  <p className="mt-4 text-slate-500">Loading students...</p>
                </div>
              )}

              {/* EMPTY */}
              {!loading && students.length === 0 && (
                <div className="flex flex-col items-center py-16 text-center">
                  <User className="w-16 h-16 text-slate-300 mb-3" />
                  <p className="text-slate-600 text-lg">
                    No students assigned to this exam
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    Add students to get started
                  </p>
                </div>
              )}

              {/* STUDENT CARDS */}
              <div className="grid gap-6">
                {students.map((s) => (
                  <div
                    key={s._id}
                    className={`
                      p-6 rounded-2xl border transition-all
                      ${
                        editingId === s._id
                          ? "border-blue-300 bg-blue-50"
                          : "border-slate-200 bg-white hover:shadow-md"
                      }
                    `}
                  >
                    <div className="flex flex-col lg:flex-row justify-between gap-6">

                      {/* AVATAR + INFO */}
                      <div className="flex items-center gap-4">
                        <div className="
                          w-14 h-14 rounded-2xl shadow 
                          bg-[linear-gradient(to_right,#3b82f6,#6366f1)]
                          text-white flex items-center justify-center 
                          text-xl font-bold
                        ">
                          {s.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {s.name}
                          </h3>

                          <p className="text-slate-500 text-sm mt-1">
                            Roll: {s.rollNo} • ID: {s._id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>

                      {/* MARKS + GRADE + ACTIONS */}
                      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">

                        {/* MARKS */}
                        <div className="text-center">
                          <p className="text-xs text-slate-500 mb-1">Marks</p>
                          {editingId === s._id ? (
                            <input
                              type="number"
                              min="0"
                              value={marksInput[s._id]}
                              onChange={(e) =>
                                setMarksInput((p) => ({
                                  ...p,
                                  [s._id]: e.target.value,
                                }))
                              }
                              className="
                                w-24 text-center border rounded-lg px-3 py-2
                                focus:ring-2 focus:ring-blue-500
                              "
                            />
                          ) : (
                            <p className={`text-lg font-semibold ${marksColor(s.marks)}`}>
                              {s.marks ?? "-"}
                            </p>
                          )}
                        </div>

                        {/* GRADE */}
                        <div className="text-center">
                          <p className="text-xs text-slate-500 mb-1">Grade</p>
                          {editingId === s._id ? (
                            <input
                              value={gradeInput[s._id]}
                              onChange={(e) =>
                                setGradeInput((p) => ({
                                  ...p,
                                  [s._id]: e.target.value.toUpperCase(),
                                }))
                              }
                              maxLength={3}
                              className="
                                w-20 text-center border rounded-lg px-3 py-2 uppercase
                                focus:ring-2 focus:ring-blue-500
                              "
                            />
                          ) : (
                            <span
                              className={`
                                px-3 py-1 text-sm rounded-lg font-medium
                                ${gradeBadge(s.grade)}
                              `}
                            >
                              {s.grade || "-"}
                            </span>
                          )}
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex gap-3">
                          {editingId === s._id ? (
                            <>
                              {/* SAVE */}
                              <button
                                onClick={() => handleSave(s._id)}
                                disabled={savingMap[s._id]}
                                className="
                                  bg-emerald-500 text-white px-4 py-2 rounded-lg
                                  hover:bg-emerald-600 active:scale-95 transition
                                  disabled:opacity-60
                                "
                              >
                                {savingMap[s._id] ? (
                                  "Saving..."
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    Save
                                  </div>
                                )}
                              </button>

                              {/* CANCEL */}
                              <button
                                onClick={cancelEdit}
                                className="
                                  bg-slate-200 text-slate-700 px-4 py-2 rounded-lg
                                  hover:bg-slate-300 active:scale-95 transition
                                "
                              >
                                <div className="flex items-center gap-2">
                                  <X className="w-4 h-4" />
                                  Cancel
                                </div>
                              </button>
                            </>
                          ) : (
                            <>
                              {/* EDIT */}
                              <button
                                onClick={() => startEdit(s)}
                                className="
                                  bg-blue-500 text-white px-4 py-2 rounded-lg
                                  hover:bg-blue-600 active:scale-95 transition
                                "
                              >
                                <div className="flex items-center gap-2">
                                  <Edit2 className="w-4 h-4" />
                                  Edit
                                </div>
                              </button>

                              {/* DELETE */}
                              {s.resultId && (
                                <button
                                  onClick={() => handleDelete(s.resultId)}
                                  disabled={deletingMap[s.resultId]}
                                  className="
                                    bg-red-500 text-white px-4 py-2 rounded-lg
                                    hover:bg-red-600 active:scale-95 transition
                                    disabled:opacity-60
                                  "
                                >
                                  <div className="flex items-center gap-2">
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </div>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} />}
    </>
  );
}

/* ---------------- STAT CARD COMPONENT ---------------- */

function StatsCard({ title, value, color }) {
  const colorMap = {
    slate: "text-slate-900",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
  };

  return (
    <div className="
      bg-white p-6 rounded-2xl border border-slate-200 shadow-sm 
      hover:shadow-md transition
    ">
      <p className="text-sm text-slate-500 mb-2">{title}</p>
      <p className={`text-3xl font-bold ${colorMap[color]}`}>{value}</p>
    </div>
  );
}
