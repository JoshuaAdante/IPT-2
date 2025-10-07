// resources/js/components/Dashboard.js
import React from "react";
import { useCounts } from "../context/CountContext";

export default function Dashboard() {
  const { counts } = useCounts();

  const cards = [
    {
      label: "Total Faculty",
      value: counts.faculties || 0,
      icon: "👨‍🏫",
      color: "bg-blue-100",
    },
    {
      label: "Total Students",
      value: counts.students || 0,
      icon: "🎓",
      color: "bg-green-100",
    },
    {
      label: "Active Courses",
      value: counts.courses || 0,
      icon: "📘",
      color: "bg-yellow-100",
    },
    {
      label: "Departments",
      value: counts.departments || 0,
      icon: "🏛️",
      color: "bg-purple-100",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
        📊 Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`${card.color} rounded-xl p-5 shadow-md flex items-center justify-between transform transition-all hover:scale-105 hover:shadow-lg`}
          >
            <span className="text-4xl">{card.icon}</span>
            <div className="text-right">
              <h3 className="text-lg font-semibold text-gray-700">
                {card.label}
              </h3>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
