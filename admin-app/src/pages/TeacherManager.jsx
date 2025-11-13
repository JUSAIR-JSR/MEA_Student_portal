import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import {
  getTeachers,
  createTeacher,
  deleteTeacher,
  updateTeacher,
  resetTeacherPassword,
} from "../api/api";

export default function TeacherManager() {
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", subject: "" });

  const loadTeachers = async () => {
    const res = await getTeachers();
    setTeachers(res.data);
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTeacher(form);
    setForm({ name: "", email: "", password: "", subject: "" });
    loadTeachers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;
    await deleteTeacher(id);
    loadTeachers();
  };

  const handleEdit = async (teacher) => {
    const newName = prompt("Enter new name", teacher.name);
    if (!newName) return;
    await updateTeacher(teacher._id, { name: newName });
    loadTeachers();
  };

  const handleReset = async (teacher) => {
    const newPassword = prompt("Enter new password");
    if (!newPassword) return;
    await resetTeacherPassword(teacher._id, newPassword);
    alert("Password reset successfully");
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Teacher Management</h1>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Teacher
          </button>
        </form>

        <Table
          title="Teachers List"
          columns={["Name", "Email", "Subject","Password"]}
          data={teachers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReset={handleReset}
        />
      </div>
    </>
  );
}
