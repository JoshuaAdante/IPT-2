import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCounts } from "../context/CountContext";

export default function Faculty() {
  const { refreshCounts } = useCounts();
  const [faculties, setFaculties] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showArchive, setShowArchive] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    faculty_id: "",
    name: "",
    email: "",
    department: "",
    position: "",
    status: "Active",
  });

  // Fetch data
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/faculties/${editingId}`, form);
        alert("✅ Faculty updated successfully!");
      } else {
        await axios.post("/api/faculties", form);
        alert("✅ Faculty added successfully!");
      }

      await fetchFaculties();
      await refreshCounts();
      closeForm();
    } catch (error) {
      console.error("Save Faculty Error:", error);
      alert("❌ Failed to save faculty.");
    }
  };

  const openForm = (faculty = null) => {
    if (faculty) {
      setEditingId(faculty.id);
      setForm({
        faculty_id: faculty.faculty_id,
        name: faculty.name,
        email: faculty.email,
        department: faculty.department,
        position: faculty.position,
        status: faculty.status,
      });
    } else {
      setEditingId(null);
      setForm({
        faculty_id: "",
        name: "",
        email: "",
        department: "",
        position: "",
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
    if (!confirm("Archive this faculty?")) return;
    try {
      await axios.patch(`/api/faculties/${id}/archive`);
      await fetchFaculties();
      await refreshCounts();
      alert("📦 Faculty archived successfully!");
    } catch (err) {
      console.error("Archive Faculty Error:", err);
      alert("❌ Failed to archive faculty.");
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.patch(`/api/faculties/${id}/restore`);
      await fetchFaculties();
      await refreshCounts();
      alert("✅ Faculty restored successfully!");
    } catch (err) {
      console.error("Restore Faculty Error:", err);
      alert("❌ Failed to restore faculty.");
    }
  };

  const activeFaculties = faculties.filter((f) => f.status !== "Archived");
  const archivedFaculties = faculties.filter((f) => f.status === "Archived");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Faculty Management
        </h2>

        <div className="flex gap-3">
          <button
            onClick={() => setShowArchive(!showArchive)}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            {showArchive ? "⬅ Back to Active Faculties" : "📦 View Archived Faculties"}
          </button>

          {!showArchive && (
            <button
              onClick={() => openForm()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              ➕ Add Faculty
            </button>
          )}
        </div>
      </div>

      {/* ✅ Modal Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {editingId ? "Edit Faculty" : "Add New Faculty"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
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
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
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
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editingId ? "Confirm Update" : "Confirm Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Faculty Tables */}
      {!showArchive ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-400 shadow-md">
            <thead className="bg-gray-200">
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
              {activeFaculties.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="border p-2">{f.faculty_id}</td>
                  <td className="border p-2">{f.name}</td>
                  <td className="border p-2">{f.email}</td>
                  <td className="border p-2">{f.department}</td>
                  <td className="border p-2">{f.position}</td>
                  <td className="border p-2">{f.status}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => openForm(f)}
                      className="bg-yellow-200 text-black px-3 py-1 rounded hover:bg-yellow-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleArchive(f.id)}
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
            Archived Faculties
          </h3>
          <table className="w-full border-collapse border border-gray-400 shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Faculty ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Department</th>
                <th className="border p-2">Position</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {archivedFaculties.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="border p-2">{f.faculty_id}</td>
                  <td className="border p-2">{f.name}</td>
                  <td className="border p-2">{f.email}</td>
                  <td className="border p-2">{f.department}</td>
                  <td className="border p-2">{f.position}</td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleRestore(f.id)}
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
