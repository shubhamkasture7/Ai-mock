// app/profile/page.js
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs"; // 👈 fetch logged-in user
import StatCard from "@/components/StatCard";
import PerformanceChart from "@/components/PerformanceChart";
import SkillsChart from "@/components/SkillsChart";
import DashboardBox from "../dashboard/_components/DashboardBox";


export default function ProfilePage() {
  const { user } = useUser();
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchHistory() {
      try {
        const res = await fetch(
          `/api/interviews?email=${user.primaryEmailAddress?.emailAddress}`
        );
        const data = await res.json();
        setInterviewHistory(data);
      } catch (error) {
        console.error("Failed to fetch interview history:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  const averageScore =
    interviewHistory.length > 0
      ? (
          interviewHistory.reduce(
            (acc, item) => acc + (parseFloat(item.score) || 0),
            0
          ) / interviewHistory.length
        ).toFixed(1)
      : 0;

  return (
    <div className="flex ">
    <div>
              <aside className="w-64">
                <DashboardBox />
              </aside>
    </div>
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <header className="flex items-center gap-4 mb-8">
          <img
            src={user?.imageUrl}
            alt="User Avatar"
            className="w-20 h-20 rounded-full border-2 border-white shadow-md"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {user?.fullName}
            </h1>
            <p className="text-md text-gray-600">Aspiring Software Engineer</p>
          </div>
        </header>

        {/* Main content grid */}
        <main className="space-y-6">
          {/* Performance Dashboard - Stat Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon="📊"
              title="Total Interviews"
              value={interviewHistory.length}
            />
            <StatCard
              icon="🎯"
              title="Average Score"
              value={`${averageScore} / 10`}
            />
            <StatCard icon="⭐" title="Top Skill" value="Problem-Solving" />
            <StatCard
              icon="📈"
              title="Area for Improvement"
              value="System Design"
            />
          </section>

          {/* Charts Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceChart data={interviewHistory} />
            <SkillsChart data={[]} /> {/* later hook into DB for real skill data */}
          </section>

          {/* Interview History Table */}
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-lg mb-4 text-gray-700">
              Interview History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b-2 border-gray-200">
                  <tr>
                    <th className="p-3 text-sm font-semibold text-gray-600">
                      Role
                    </th>
                    <th className="p-3 text-sm font-semibold text-gray-600">
                      Date
                    </th>
                    <th className="p-3 text-sm font-semibold text-gray-600">
                      Score
                    </th>
                    <th className="p-3 text-sm font-semibold text-gray-600"></th>
                  </tr>
                </thead>
                <tbody>
                  {interviewHistory.map((interview) => (
                    <tr
                      key={interview.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="p-4 font-medium text-gray-800">
                        {interview.role}
                      </td>
                      <td className="p-4 text-gray-600">
                        {interview.date
                          ? new Date(interview.date).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric", year: "numeric" }
                            )
                          : "N/A"}
                      </td>
                      <td className="p-4 text-gray-800 font-semibold">
                        {interview.score ? interview.score : "N/A"} / 10
                      </td>
                      <td className="p-4 text-right">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                          View Feedback
                        </button>
                      </td>
                    </tr>
                  ))}
                  {interviewHistory.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-gray-500">
                        No interviews found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
    </div>
  );
}
