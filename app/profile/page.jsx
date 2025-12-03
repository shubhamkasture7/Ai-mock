// app/profile/page.js
"use client";

import { useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import useSWR from "swr";
import dynamic from "next/dynamic";

import StatCard from "@/components/StatCard";

// Lazy-loaded performance chart
const PerformanceChart = dynamic(
  () => import("@/components/PerformanceChart"),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 w-full bg-white border border-gray-100 rounded-2xl shadow-sm animate-pulse" />
    ),
  }
);

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ProfilePage() {
  const { user } = useUser();

  const [interviewHistory, setInterviewHistory] = useState([]);
  const [ratingCounts, setRatingCounts] = useState({});
  const [totalGenerated, setTotalGenerated] = useState(0);

  const email = user?.primaryEmailAddress?.emailAddress;

  const { data, isLoading } = useSWR(
    email ? `/api/interviews?email=${email}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (!data) return;
    setInterviewHistory(data.interviews || data);
    setRatingCounts(data.ratingCounts || {});
    setTotalGenerated(data.totalGenerated || data.length || 0);
  }, [data]);

  // 📊 Stats (memoized)
  const stats = useMemo(() => {
    const total = totalGenerated;
    const avg =
      total > 0
        ? (
            interviewHistory.reduce(
              (acc, i) => acc + (parseFloat(i.score) || 0),
              0
            ) / total
          ).toFixed(1)
        : 0;

    return {
      totalInterviews: total,
      averageScore: avg,
      skillImprovement: total > 5 ? "+32%" : "+10%",
      timeSaved: `${total * 2}h`,
    };
  }, [interviewHistory, totalGenerated]);

  // 🧠 Practice Insights (best score, last interview, most practiced role)
  const insights = useMemo(() => {
    if (!interviewHistory || interviewHistory.length === 0) {
      return {
        lastRole: "—",
        lastDate: "—",
        bestScore: "—",
        mostPracticedRole: "—",
      };
    }

    // Assuming latest first; if not, sort by date
    const sorted = [...interviewHistory].sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date) - new Date(a.date);
    });

    const last = sorted[0];

    let bestScore = 0;
    let roleCount = {};

    for (const item of interviewHistory) {
      const scoreNum = parseFloat(item.score) || 0;
      if (scoreNum > bestScore) bestScore = scoreNum;

      if (item.role) {
        roleCount[item.role] = (roleCount[item.role] || 0) + 1;
      }
    }

    let mostPracticedRole = "—";
    let maxCount = 0;
    Object.entries(roleCount).forEach(([role, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostPracticedRole = role;
      }
    });

    return {
      lastRole: last.role || "—",
      lastDate: last.date
        ? new Date(last.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "—",
      bestScore: bestScore > 0 ? `${bestScore.toFixed(1)} / 10` : "—",
      mostPracticedRole,
    };
  }, [interviewHistory]);

  /* ----------------- SHADOW SKELETON LOADER ----------------- */
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          {/* Header skeleton */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 shadow-sm" />
            <div className="space-y-3">
              <div className="h-5 w-40 bg-gray-200 rounded-md shadow-sm" />
              <div className="h-4 w-32 bg-gray-100 rounded-md shadow-sm" />
            </div>
          </div>

          {/* Stat cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((k) => (
              <div
                key={k}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
              >
                <div className="h-4 w-24 bg-gray-100 rounded mb-3" />
                <div className="h-6 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>

          {/* Charts skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-72 bg-white border border-gray-100 rounded-2xl shadow-sm" />
            <div className="h-72 bg-white border border-gray-100 rounded-2xl shadow-sm" />
          </div>

          {/* Table skeleton */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
            <div className="space-y-2">
              <div className="h-10 w-full bg-gray-50 rounded-lg" />
              <div className="h-10 w-full bg-gray-50 rounded-lg" />
              <div className="h-10 w-full bg-gray-50 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ----------------- MAIN UI ----------------- */
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <header className="flex items-center gap-4 mb-8">
          <img
            src={user?.imageUrl}
            alt="User Avatar"
            className="w-20 h-20 rounded-full border-2 border-white shadow-md object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {user?.fullName}
            </h1>
            <p className="text-md text-gray-600">
              Aspiring Software Engineer • {stats.totalInterviews} interviews
              completed
            </p>
          </div>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            icon="📊"
            title="Total Interviews"
            value={stats.totalInterviews}
          />
          <StatCard
            icon="🎯"
            title="Average Score"
            value={`${stats.averageScore} / 10`}
          />
          <StatCard icon="⭐" title="Top Skill" value="Problem-Solving" />
          <StatCard icon="⏱️" title="Time Saved" value={stats.timeSaved} />
        </section>

        {/* Performance + Practice Insights */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PerformanceChart data={interviewHistory} />

          {/* 👉 Practice Insights card (replacing SkillsChart) */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                Practice Insights
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                A quick snapshot of your recent performance and practice trends.
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Interview Role</span>
                  <span className="font-medium text-gray-800">
                    {insights.lastRole}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Interview Date</span>
                  <span className="font-medium text-gray-800">
                    {insights.lastDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Best Score</span>
                  <span className="font-medium text-emerald-600">
                    {insights.bestScore}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Most Practiced Role</span>
                  <span className="font-medium text-indigo-600">
                    {insights.mostPracticedRole}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-[11px] text-gray-400">
              Tip: Try repeating interviews for the same role and track how your
              best score improves over time.
            </p>
          </div>
        </section>

        {/* Interview History Table */}
        <section className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-gray-800">
              Interview History
            </h3>
            <span className="text-xs text-gray-400">
              {interviewHistory.length} records
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="p-3 font-semibold text-gray-600">Role</th>
                  <th className="p-3 font-semibold text-gray-600">Date</th>
                  <th className="p-3 font-semibold text-gray-600">Score</th>
                  <th className="p-3 font-semibold text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                {interviewHistory.map((interview) => (
                  <tr
                    key={interview.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 font-medium text-gray-800 truncate max-w-xs">
                      {interview.role}
                    </td>
                    <td className="p-3 text-gray-600">
                      {interview.date
                        ? new Date(interview.date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </td>
                    <td className="p-3 text-gray-800 font-semibold">
                      {interview.score ? interview.score : "N/A"} / 10
                    </td>
                    <td className="p-3 text-right">
                      <button className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                        View Feedback
                      </button>
                    </td>
                  </tr>
                ))}
                {interviewHistory.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-4 text-center text-gray-500 text-sm"
                    >
                      No interviews found yet. Start a mock interview from the
                      dashboard to see your history here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ⭐ Interviews by Rating */}
        {Object.keys(ratingCounts).length > 0 && (
          <section className="mt-2">
            <h3 className="font-semibold text-lg mb-3 text-gray-800">
              Interviews by Rating
            </h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(ratingCounts).map(([rating, count]) => (
                <div
                  key={rating}
                  className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm min-w-[100px]"
                >
                  <p className="text-xs text-gray-500 mb-1">
                    Rating {rating}
                  </p>
                  <h4 className="text-lg font-semibold">{count}</h4>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
