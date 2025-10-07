import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCounts } from "../context/CountContext";

export default function Department() {
  const { refreshCounts } = useCounts();
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    department_code: "",
    department_name: "",
    status: "Active",
  });

  const fetchDepartments = async () => {
    const res = await axios.get("/api/departments");
    setDepartments(res.data);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/departments", form);
    await fetchDepartments();
    await refreshCounts(); // ✅ updates Dashboard total
    setForm({ department_code: "", department_name: "", status: "Active" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this department?")) return;
    await axios.delete(`/api/departments/${id}`);
    await fetchDepartments();
    await refreshCounts();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Department Management</h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input type="text" placeholder="Department Code"
          value={form.department_code} onChange={(e) => setForm({ ...form, department_code: e.target.value })}
          className="border p-2 w-full rounded" required />
        <input type="text" placeholder="Department Name"
          value={form.department_name} onChange={(e) => setForm({ ...form, department_name: e.target.value })}
          className="border p-2 w-full rounded" required />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="border p-2 w-full rounded">
          <option>Active</option>
          <option>Inactive</option>
          <option>Archived</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Department</button>
      </form>

      <table className="w-full border-collapse border border-gray-400">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Code</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((d) => (
            <tr key={d.id}>
              <td className="border p-2">{d.department_code}</td>
              <td className="border p-2">{d.department_name}</td>
              <td className="border p-2">{d.status}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(d.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
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
