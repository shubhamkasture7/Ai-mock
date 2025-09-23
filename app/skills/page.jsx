"use client";

import React from "react";
import DashboardBox from "../dashboard/_components/DashboardBox";

export default function SkillsPage() {
  const skills = [
    {
      title: "Data Structures",
      desc: "Master arrays, linked lists, trees, graphs, and more.",
      link: "https://www.geeksforgeeks.org/data-structures/",
    },
    {
      title: "Algorithms",
      desc: "Learn sorting, searching, dynamic programming, and graph algorithms.",
      link: "https://www.geeksforgeeks.org/fundamentals-of-algorithms/",
    },
    {
      title: "DBMS",
      desc: "Understand relational databases, SQL, normalization, and transactions.",
      link: "https://www.geeksforgeeks.org/dbms/",
    },
    {
      title: "Operating Systems",
      desc: "Study processes, threads, scheduling, memory, and file systems.",
      link: "https://www.geeksforgeeks.org/operating-system/",
    },
    {
      title: "System Design",
      desc: "Learn how to design scalable, reliable, and efficient systems.",
      link: "https://www.geeksforgeeks.org/system-design-tutorial/",
    },
    {
      title: "Computer Networks",
      desc: "Understand networking concepts, TCP/IP, routing, and protocols.",
      link: "https://www.geeksforgeeks.org/computer-network-tutorials/",
    },
  ];

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64">
        <DashboardBox />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="bg-[#0A1730] text-white rounded-lg p-6 mb-8 shadow">
          <h1 className="text-2xl font-bold">Skills & Learning</h1>
          <p className="text-sm text-gray-300 mt-1">
            Explore essential computer science skills and strengthen your fundamentals.
          </p>
        </div>

        {/* Skill Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="border rounded-lg p-5 shadow-sm bg-white hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {skill.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{skill.desc}</p>

              <button
                onClick={() => window.open(skill.link, "_blank")}
                className="mt-4 text-sm bg-[#0A1730] text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Learn More
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
