import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Faculty from "./Faculty";
import Students from "./Students";

export default function Layout() {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4 flex flex-col">
        {/* Logo + Title */}
        <div className="flex items-center mb-8">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 mr-2" />
          <h1 className="text-xl font-bold text-blue-600">AcadeMe</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-1">
            <li
              className={`p-2 cursor-pointer hover:bg-gray-100 rounded ${
                page === "dashboard" && "bg-gray-200 font-semibold"
              }`}
              onClick={() => setPage("dashboard")}
            >
              Dashboard
            </li>
            <li
              className={`p-2 cursor-pointer hover:bg-gray-100 rounded ${
                page === "faculty" && "bg-gray-200 font-semibold"
              }`}
              onClick={() => setPage("faculty")}
            >
              Faculty
            </li>
            <li
              className={`p-2 cursor-pointer hover:bg-gray-100 rounded ${
                page === "students" && "bg-gray-200 font-semibold"
              }`}
              onClick={() => setPage("students")}
            >
              Students
            </li>
            <li className="p-2 cursor-pointer hover:bg-gray-100 rounded">
              Reports
            </li>
            <li className="p-2 cursor-pointer hover:bg-gray-100 rounded">
              Settings
            </li>
            <li className="p-2 cursor-pointer hover:bg-gray-100 rounded">
              My Profile
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        {page === "dashboard" && <Dashboard />}
        {page === "faculty" && <Faculty />}
        {page === "students" && <Students />}
      </div>
    </div>
  );
}
