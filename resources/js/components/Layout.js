// resources/js/components/Layout.js
import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Faculty from "./Faculty";
import Students from "./Students";
import "../../sass/layout.scss";

export default function Layout() {
  const [page, setPage] = useState("dashboard");

  const menuItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "faculty", label: "Faculty" },
    { key: "students", label: "Students" },
    { key: "reports", label: "Reports" },
    { key: "settings", label: "Settings" },
    { key: "profile", label: "Profile" },
  ];

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-section">
          <img src="/logo.png" alt="Logo" className="logo" />
          <h1 className="brand">AcadMe</h1>
        </div>

        <ul className="nav-menu">
          {menuItems.map((item) => (
            <li
              key={item.key}
              className={`nav-item ${page === item.key ? "active" : ""}`}
              onClick={() => setPage(item.key)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {page === "dashboard" && <Dashboard />}
        {page === "faculty" && <Faculty />}
        {page === "students" && <Students />}
      </main>
    </div>
  );
}
