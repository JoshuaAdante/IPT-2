import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCounts } from "../context/CountContext";

export default function Students() {
  const { refreshCounts } = useCounts();
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showArchive, setShowArchive] = useState(false);
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
      console.error("❌ Failed to fetch students:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ Save or update student
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/students/${editingId}`, form);
        alert("✅ Student updated successfully!");
      } else {
        await axios.post("/api/students", form);
        alert("✅ Student added successfully!");
      }

      await fetchStudents();
      await refreshCounts();
      resetForm();
    } catch (error) {
      console.error("❌ Save Student Error:", error);
      alert("Failed to save student. Check console for details.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      student_id: "",
      name: "",
      email: "",
      department: "",
      course: "",
      status: "Active",
    });
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setForm({
      student_id: student.student_id,
      name: student.name,
      email: student.email,
      department: student.department,
      course: student.course,
      status: student.status,
    });
  };

  // ✅ Archive (soft delete)
  const handleArchive = async (id) => {
    if (!confirm("Archive this student?")) return;
    try {
      await axios.patch(`/api/students/${id}/archive`);
      await fetchStudents();
      await refreshCounts();
      alert("📦 Student archived successfully!");
    } catch (err) {
      console.error("Archive Student Error:", err);
      alert("❌ Failed to archive student.");
    }
  };

  // ✅ Restore from archive
  const handleRestore = async (id) => {
    try {
      await axios.patch(`/api/students/${id}/restore`);
      await fetchStudents();
      await refreshCounts();
      alert("✅ Student restored successfully!");
    } catch (err) {
      console.error("Restore Student Error:", err);
      alert("❌ Failed to restore student.");
    }
  };

  // Filter students
  const activeStudents = students.filter((s) => s.status !== "Archived");
  const archivedStudents = students.filter((s) => s.status === "Archived");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Student Management</h2>

      <button
        onClick={() => setShowArchive(!showArchive)}
        className="mb-4 bg-gray-300 text-black font-medium px-4 py-2 rounded hover:bg-gray-400"
      >
        {showArchive ? "⬅ Back to Active Students" : "📦 View Archived Students"}
      </button>

      {!showArchive ? (
        <>
          {/* Add/Edit Form */}
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

            <button className="bg-blue-300 text-black font-semibold px-4 py-2 rounded hover:bg-blue-400">
              {editingId ? "Update Student" : "Add Student"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="ml-2 bg-gray-300 text-black font-semibold px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
          </form>

          {/* ✅ Active Students Table */}
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
              {activeStudents.map((s) => (
                <tr key={s.id}>
                  <td className="border p-2">{s.student_id}</td>
                  <td className="border p-2">{s.name}</td>
                  <td className="border p-2">{s.email}</td>
                  <td className="border p-2">{s.department}</td>
                  <td className="border p-2">{s.course}</td>
                  <td className="border p-2">{s.status}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(s)}
                      className="bg-yellow-300 text-black font-semibold px-3 py-1 rounded hover:bg-yellow-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleArchive(s.id)}
                      className="bg-red-300 text-black font-semibold px-3 py-1 rounded hover:bg-red-400"
                    >
                      Archive
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        // ✅ Archived Students Table
        <div>
          <h3 className="text-xl font-semibold mb-3">Archived Students</h3>
          <table className="w-full border-collapse border border-gray-400">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Student ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Department</th>
                <th className="border p-2">Course</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {archivedStudents.map((s) => (
                <tr key={s.id}>
                  <td className="border p-2">{s.student_id}</td>
                  <td className="border p-2">{s.name}</td>
                  <td className="border p-2">{s.email}</td>
                  <td className="border p-2">{s.department}</td>
                  <td className="border p-2">{s.course}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleRestore(s.id)}
                      className="bg-green-300 text-black font-semibold px-3 py-1 rounded hover:bg-green-400"
                    >
                      Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
