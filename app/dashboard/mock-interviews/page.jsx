"use client";

import React from "react";
import InterviewList from "../_components/InterviewList"; // ✅ make sure this path is correct

export default function MockInterviewPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-[#0A1730] text-white rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold">Mock Interview Page</h2>
        <p className="text-sm text-gray-300 mt-1">
          Start new interviews or review your previous ones.
        </p>
      </div>

      {/* Previous Interview List */}
      <InterviewList />
    </div>
  );
}
