// resources/js/components/Students.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCounts } from "../context/CountContext";

export default function Students() {
  const { refreshCounts } = useCounts();
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    student_id: "",
    name: "",
    email: "",
    department: "",
    course: "",
    status: "Active",
  });

  // ✅ Fetch all students
  const fetchStudents = async () => {
    try {
      const res = await axios.get("/api/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ Add new student
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/students", form);
      await fetchStudents();
      await refreshCounts(); // 🔁 update dashboard
      setForm({
        student_id: "",
        name: "",
        email: "",
        department: "",
        course: "",
        status: "Active",
      });
      alert("✅ Student added successfully!");
    } catch (error) {
      console.error("Add Student Error:", error);
      alert("❌ Failed to save student. Check console or backend.");
    }
  };

  // ✅ Delete student
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`/api/students/${id}`);
      await fetchStudents();
      await refreshCounts(); // 🔁 update dashboard
    } catch (err) {
      console.error("Delete Student Error:", err);
      alert("Failed to delete student.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Student Management</h2>

      {/* Add Student Form */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Student ID"
          value={form.student_id}
          onChange={(e) => setForm({ ...form, student_id: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />

        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />

        <input
          type="text"
          placeholder="Department"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />

        <input
          type="text"
          placeholder="Course"
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />

        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="border p-2 w-full rounded"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Archived">Archived</option>
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Student
        </button>
      </form>

      {/* Students Table */}
      <table className="w-full border-collapse border border-gray-400">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Student ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Course</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td className="border p-2">{s.student_id}</td>
              <td className="border p-2">{s.name}</td>
              <td className="border p-2">{s.email}</td>
              <td className="border p-2">{s.department}</td>
              <td className="border p-2">{s.course}</td>
              <td className="border p-2">{s.status}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(s.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
