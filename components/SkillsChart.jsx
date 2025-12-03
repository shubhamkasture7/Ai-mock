// app/components/SkillsChart.js
"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SkillsChart({ data = [] }) {
  const hasData = Array.isArray(data) && data.length > 0;

  // Optional: fallback demo data if you want to always show something
  const chartData = hasData
    ? data
    : [
        { skill: "DSA", score: 7 },
        { skill: "Frontend", score: 8 },
        { skill: "Backend", score: 6 },
        { skill: "System Design", score: 5 },
        { skill: "Communication", score: 8 },
      ];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-80">
      <h3 className="font-semibold text-lg mb-4 text-gray-700">
        Skills Breakdown
      </h3>

      {!hasData ? (
        <div className="h-full flex items-center justify-center text-sm text-gray-400">
          No skill data available yet.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx="50%"
            cy="55%"
            outerRadius="70%"
            data={data}
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 10]} // assuming score is 0–10
              tick={{ fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                fontSize: "12px",
              }}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#4f46e5"
              fill="#4f46e5"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
