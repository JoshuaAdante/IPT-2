// resources/js/components/Dashboard.js
import React from "react";
import { useCounts } from "../context/CountContext";
import "../../sass/dashboard.scss";

export default function Dashboard() {
  const { counts } = useCounts();

  const cards = [
    {
      label: "Total Students",
      value: counts.students || 0,
      icon: "🎓",
    },
    {
      label: "Total Faculty",
      value: counts.faculties || 0,
      icon: "👨‍🏫",
    },
    {
      label: "Active Courses",
      value: counts.courses || 0,
      icon: "📘",
    },
    {
      label: "Departments",
      value: counts.departments || 0,
      icon: "🏛️",
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <button className="signout-btn">Sign Out</button>
      </div>

      <div className="cards-grid">
        {cards.map((card) => (
          <div key={card.label} className="info-card">
            <div className="card-icon">{card.icon}</div>
            <div className="card-details">
              <h3>{card.label}</h3>
              <p>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-section">
        <div className="chart-box">📊 Students per Course</div>
        <div className="chart-box">🟢 Faculty per Department</div>
        <div className="chart-box">📈 Students per Department</div>
        <div className="chart-box">🟣 Enrollments by Semester</div>
      </div>

      <div className="activity-section">
        <h3>Recently Activity</h3>
        <p>Mass enrollment completed — 1,234 students successfully enrolled.</p>
        <span>2h ago</span>
      </div>
    </div>
  );
}
