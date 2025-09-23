// app/components/PerformanceChart.js
"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PerformanceChart({ data }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-80">
      <h3 className="font-semibold text-lg mb-4 text-gray-700">Performance Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis domain={[0, 10]} stroke="#6b7280" />
          <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }} />
          <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}