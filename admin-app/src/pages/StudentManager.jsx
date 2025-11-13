import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import {
  getStudents,
  createStudent,
  deleteStudent,
  updateStudent,
  resetStudentPassword,
} from "../api/api";

export default function StudentManager() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", rollNo: "", department: "" });

  const loadStudents = async () => {
    const res = await getStudents();
    setStudents(res.data);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createStudent(form);
    setForm({ name: "", email: "", password: "", rollNo: "", department: "" });
    loadStudents();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    await deleteStudent(id);
    loadStudents();
  };

  const handleEdit = async (student) => {
    const newDept = prompt("Enter new department", student.department);
    if (!newDept) return;
    await updateStudent(student._id, { department: newDept });
    loadStudents();
  };

  const handleReset = async (student) => {
    const newPassword = prompt("Enter new password");
    if (!newPassword) return;
    await resetStudentPassword(student._id, newPassword);
    alert("Password reset successfully");
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Student Management</h1>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-6 flex-wrap">
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
            placeholder="Roll No"
            value={form.rollNo}
            onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Student
          </button>
        </form>

        <Table
          title="Students List"
          columns={["Name", "Email", "RollNo", "Department", "Password"]}
          data={students}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReset={handleReset}
        />
      </div>
    </>
  );
}
