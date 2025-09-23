"use client";

import React from "react";
import DashboardBox from "../dashboard/_components/DashboardBox";

export default function JobsPage() {
  const jobs = [
    {
      title: "Frontend Developer",
      company: "TechCorp",
      experience: "2+ years",
      posted: "15-12-2024",
      status: "Open",
      type: "Full-Time",
    },
    {
      title: "Backend Engineer",
      company: "CodeWorks",
      experience: "3+ years",
      posted: "12-12-2024",
      status: "Applied",
      type: "Remote",
    },
    {
      title: "UI/UX Designer",
      company: "Designify",
      experience: "1+ years",
      posted: "10-12-2024",
      status: "Interview Scheduled",
      type: "Contract",
    },
    {
      title: "Data Scientist",
      company: "AI Labs",
      experience: "4+ years",
      posted: "08-12-2024",
      status: "Saved",
      type: "Full-Time",
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
          <h1 className="text-2xl font-bold">Browse Jobs</h1>
          <p className="text-sm text-gray-300 mt-1">
            Explore jobs tailored to your skills and apply directly.
          </p>
        </div>

        {/* Job Listings */}
        <h2 className="text-lg font-semibold mb-4">Available Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="border rounded-lg p-5 shadow-sm bg-white hover:shadow-md transition"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-600">{job.company}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {job.experience} • {job.type}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Posted: {job.posted}
                </p>
              </div>

              {/* Status + Actions */}
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    job.status === "Open"
                      ? "bg-green-100 text-green-600"
                      : job.status === "Applied"
                      ? "bg-blue-100 text-blue-600"
                      : job.status === "Interview Scheduled"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {job.status}
                </span>
                <button className="text-sm bg-[#0A1730] text-white px-3 py-1.5 rounded hover:bg-indigo-700">
                  {job.status === "Applied" ? "View" : "Apply"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
          <div className="bg-white p-5 rounded-lg shadow text-center">
            <p className="text-lg font-bold text-gray-900">42</p>
            <p className="text-sm text-gray-500">Total Jobs</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow text-center">
            <p className="text-lg font-bold text-gray-900">12</p>
            <p className="text-sm text-gray-500">Applied</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow text-center">
            <p className="text-lg font-bold text-gray-900">6</p>
            <p className="text-sm text-gray-500">Saved</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow text-center">
            <p className="text-lg font-bold text-gray-900">3</p>
            <p className="text-sm text-gray-500">Interviews</p>
          </div>
        </div>
      </main>
    </div>
  );
}
