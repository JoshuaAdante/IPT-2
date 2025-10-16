import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../sass/reports.scss";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("students");
  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [studentRes, facultyRes] = await Promise.all([
        axios.get("/api/students"),
        axios.get("/api/faculties"),
      ]);
      setStudents(studentRes.data);
      setFaculties(facultyRes.data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>Reports</h2>
        <p>Generate and download reports for students and faculty</p>
      </div>

      <div className="report-content">
        <h3 className="section-title">
          {activeTab === "students" ? "Student Reports" : "Faculty Reports"}
        </h3>

        <div className="tab-buttons">
          <button
            className={activeTab === "students" ? "active" : ""}
            onClick={() => setActiveTab("students")}
          >
            Students
          </button>
          <button
            className={activeTab === "faculty" ? "active" : ""}
            onClick={() => setActiveTab("faculty")}
          >
            Faculty
          </button>
        </div>

        <div className="report-table">
          {activeTab === "students" ? (
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Course</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td>{s.student_id}</td>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.department}</td>
                    <td>{s.course}</td>
                    <td>{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Faculty ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {faculties.map((f) => (
                  <tr key={f.id}>
                    <td>{f.faculty_id}</td>
                    <td>{f.name}</td>
                    <td>{f.email}</td>
                    <td>{f.department}</td>
                    <td>{f.position}</td>
                    <td>{f.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
