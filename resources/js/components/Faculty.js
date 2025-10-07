// resources/js/components/Faculty.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCounts } from "../context/CountContext";

export default function Faculty() {
  const { refreshCounts } = useCounts();
  const [faculties, setFaculties] = useState([]);
  const [form, setForm] = useState({
    faculty_id: "",
    name: "",
    email: "",
    department: "",
    position: "",
    status: "Active",
  });

  // ✅ Fetch all faculty
  const fetchFaculties = async () => {
    try {
      const res = await axios.get("/api/faculties");
      setFaculties(res.data);
    } catch (err) {
      console.error("Failed to fetch faculties:", err);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  // ✅ Add new faculty
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/faculties", form);
      await fetchFaculties();
      await refreshCounts(); // 🔁 update dashboard
      setForm({
        faculty_id: "",
        name: "",
        email: "",
        department: "",
        position: "",
        status: "Active",
      });
      alert("✅ Faculty added successfully!");
    } catch (error) {
      console.error("Add Faculty Error:", error);
      alert("❌ Failed to save faculty. Check console or backend.");
    }
  };

  // ✅ Delete faculty
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this faculty?")) return;
    try {
      await axios.delete(`/api/faculties/${id}`);
      await fetchFaculties();
      await refreshCounts(); // 🔁 update dashboard
    } catch (err) {
      console.error("Delete Faculty Error:", err);
      alert("Failed to delete faculty.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Faculty Management</h2>

      {/* Add Faculty Form */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Faculty ID"
          value={form.faculty_id}
          onChange={(e) => setForm({ ...form, faculty_id: e.target.value })}
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
          placeholder="Position"
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
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
          Add Faculty
        </button>
      </form>

      {/* Faculty Table */}
      <table className="w-full border-collapse border border-gray-400">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Faculty ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Position</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {faculties.map((f) => (
            <tr key={f.id}>
              <td className="border p-2">{f.faculty_id}</td>
              <td className="border p-2">{f.name}</td>
              <td className="border p-2">{f.email}</td>
              <td className="border p-2">{f.department}</td>
              <td className="border p-2">{f.position}</td>
              <td className="border p-2">{f.status}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(f.id)}
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
