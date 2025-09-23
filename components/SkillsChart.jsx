// app/components/SkillsChart.js
"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function SkillsChart({ data }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-80">
      <h3 className="font-semibold text-lg mb-4 text-gray-700">Skills Breakdown</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="skill" />
          <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }} />
          <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}