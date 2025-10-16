import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCounts } from "../context/CountContext";

export default function Students() {
  const { refreshCounts } = useCounts();
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showArchive, setShowArchive] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    student_id: "",
    name: "",
    email: "",
    department: "",
    course: "",
    year_level: "",
    status: "Active",
  });

  // ✅ Fetch Students
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
      closeForm();
    } catch (error) {
      console.error("Save Student Error:", error);
      alert("❌ Failed to save student.");
    }
  };

  const openForm = (student = null) => {
    if (student) {
      setEditingId(student.id);
      setForm({
        student_id: student.student_id,
        name: student.name,
        email: student.email,
        department: student.department,
        course: student.course,
        year_level: student.year_level,
        status: student.status,
      });
    } else {
      setEditingId(null);
      setForm({
        student_id: "",
        name: "",
        email: "",
        department: "",
        course: "",
        year_level: "",
        status: "Active",
      });
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

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

  // ✅ Filters
  const activeStudents = students.filter((s) => s.status !== "Archived");
  const archivedStudents = students.filter((s) => s.status === "Archived");

  // ✅ Optional: Sort by Year Level
  const sortedStudents = [...activeStudents].sort((a, b) =>
    a.year_level.localeCompare(b.year_level)
  );

  return (
    <div className="p-6 text-black">
      {/* Header + Buttons */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Student Management
        </h2>

        <div className="flex gap-3">
          <button
            onClick={() => setShowArchive(!showArchive)}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            {showArchive ? "⬅ Back to Active Students" : "📦 View Archived Students"}
          </button>

          {!showArchive && (
            <button
              onClick={() => openForm()}
              className="bg-blue-200 text-black px-4 py-2 rounded hover:bg-blue-300"
            >
              ➕ Add Student
            </button>
          )}
        </div>
      </div>

      {/* ✅ Modal Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg text-black">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {editingId ? "Edit Student" : "Add New Student"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Student ID"
                value={form.student_id}
                onChange={(e) =>
                  setForm({ ...form, student_id: e.target.value })
                }
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
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
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

              {/* ✅ Fixed Year Level Dropdown */}
              <select
                value={form.year_level}
                onChange={(e) => setForm({ ...form, year_level: e.target.value })}
                className="border p-2 w-full rounded"
                required
              >
                <option value=""> Select Year Level </option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>

              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="border p-2 w-full rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-200 text-black px-4 py-2 rounded hover:bg-blue-300"
                >
                  {editingId ? "Confirm Update" : "Confirm Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Students Table */}
      {!showArchive ? (
        <div className="overflow-x-auto text-black">
          <table className="w-full border-collapse border border-gray-400 shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Student ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Department</th>
                <th className="border p-2">Course</th>
                <th className="border p-2">Year Level</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="border p-2">{s.student_id}</td>
                  <td className="border p-2">{s.name}</td>
                  <td className="border p-2">{s.email}</td>
                  <td className="border p-2">{s.department}</td>
                  <td className="border p-2">{s.course}</td>
                  <td className="border p-2">{s.year_level}</td>
                  <td className="border p-2">{s.status}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => openForm(s)}
                      className="bg-yellow-200 text-black px-3 py-1 rounded hover:bg-yellow-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleArchive(s.id)}
                      className="bg-red-200 text-black px-3 py-1 rounded hover:bg-red-300"
                    >
                      Archive
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            Archived Students
          </h3>
          <table className="w-full border-collapse border border-gray-400 shadow-md text-black">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Student ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Department</th>
                <th className="border p-2">Course</th>
                <th className="border p-2">Year Level</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {archivedStudents.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="border p-2">{s.student_id}</td>
                  <td className="border p-2">{s.name}</td>
                  <td className="border p-2">{s.email}</td>
                  <td className="border p-2">{s.department}</td>
                  <td className="border p-2">{s.course}</td>
                  <td className="border p-2">{s.year_level}</td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleRestore(s.id)}
                      className="bg-green-200 text-black px-3 py-1 rounded hover:bg-green-300"
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
