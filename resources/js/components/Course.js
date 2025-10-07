import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCounts } from "../context/CountContext";

export default function Course() {
  const { refreshCounts } = useCounts();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    course_code: "",
    course_name: "",
    department: "",
    status: "Active",
  });

  const fetchCourses = async () => {
    const res = await axios.get("/api/courses");
    setCourses(res.data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/courses", form);
    await fetchCourses();
    await refreshCounts(); // ✅ updates Dashboard total
    setForm({ course_code: "", course_name: "", department: "", status: "Active" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this course?")) return;
    await axios.delete(`/api/courses/${id}`);
    await fetchCourses();
    await refreshCounts();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Course Management</h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input type="text" placeholder="Course Code"
          value={form.course_code} onChange={(e) => setForm({ ...form, course_code: e.target.value })}
          className="border p-2 w-full rounded" required />
        <input type="text" placeholder="Course Name"
          value={form.course_name} onChange={(e) => setForm({ ...form, course_name: e.target.value })}
          className="border p-2 w-full rounded" required />
        <input type="text" placeholder="Department"
          value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
          className="border p-2 w-full rounded" required />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="border p-2 w-full rounded">
          <option>Active</option>
          <option>Inactive</option>
          <option>Archived</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Course</button>
      </form>

      <table className="w-full border-collapse border border-gray-400">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Course Code</th>
            <th className="border p-2">Course Name</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.course_code}</td>
              <td className="border p-2">{c.course_name}</td>
              <td className="border p-2">{c.department}</td>
              <td className="border p-2">{c.status}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(c.id)}
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
