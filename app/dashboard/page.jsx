"use client";
import React, { useEffect, useState } from "react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";
import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";

function Dashboard() {
  const { user } = useUser();
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const result = await db
        .select({
          id: MockInterview.id,
          role: MockInterview.jsonPosition,
          date: MockInterview.createdAt,
          score: UserAnswer.rating,
        })
        .from(MockInterview)
        .leftJoin(UserAnswer, eq(MockInterview.mockId, UserAnswer.mockIdRef))
        .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(MockInterview.id));

      console.log("Dashboard Data:", result);
      setInterviewHistory(result);
    } catch (error) {
      console.error("❌ Failed to fetch interview history:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading Dashboard...</p>
      </div>
    );
  }

  // 📊 Stats
  const totalInterviews = interviewHistory.length;
  const averageScore =
    totalInterviews > 0
      ? (
          interviewHistory.reduce(
            (acc, item) => acc + (parseFloat(item.score) || 0),
            0
          ) / totalInterviews
        ).toFixed(1)
      : 0;

  const skillImprovement = totalInterviews > 5 ? "+32%" : "+10%";
  const timeSaved = `${totalInterviews * 2}h`; // Example logic

  return (
    <div className="w-full p-6">
      {/* 🔵 Top Banner */}
      <div className="bg-[#0A1730] text-white rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold">
          Welcome to your AI Mock Interview Dashboard
        </h2>
        <p className="text-sm text-gray-300 mt-1">
          Create and start your AI-powered mock interviews tailored to your role
          and experience.
        </p>

        {/* Stats Row inside banner */}
        <div className="flex gap-8 mt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              %
            </div>
            <div>
              <h3 className="text-lg font-semibold">85%</h3>
              <p className="text-gray-300 text-sm">Profile Completion</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
              🎯
            </div>
            <div>
              <h3 className="text-lg font-semibold">{totalInterviews}</h3>
              <p className="text-gray-300 text-sm">Interviews Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* ➕ Add New Interview */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center mb-10">
        <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-full mb-3 text-2xl">
          +
        </div>
        <h3 className="font-semibold text-lg">Add New Interview</h3>
        <p className="text-gray-500 text-sm mt-1">
          Start a new mock interview session
        </p>
        <AddNewInterview />
      </div>

      {/* 📋 Previous Interviews */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Previous Mock Interviews</h3>
          <button className="text-sm text-blue-600 hover:underline">
            View All
          </button>
        </div>
        <InterviewList />
      </div>

      {/* 📊 Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
        <div className="bg-white border rounded-xl p-6 text-center shadow-sm">
          <h4 className="text-lg font-bold">{totalInterviews}</h4>
          <p className="text-gray-500 text-sm">Total Interviews</p>
        </div>
        <div className="bg-white border rounded-xl p-6 text-center shadow-sm">
          <h4 className="text-lg font-bold">{averageScore}</h4>
          <p className="text-gray-500 text-sm">Average Score</p>
        </div>
        <div className="bg-white border rounded-xl p-6 text-center shadow-sm">
          <h4 className="text-lg font-bold">{timeSaved}</h4>
          <p className="text-gray-500 text-sm">Time Saved</p>
        </div>
        <div className="bg-white border rounded-xl p-6 text-center shadow-sm">
          <h4 className="text-lg font-bold">{skillImprovement}</h4>
          <p className="text-gray-500 text-sm">Skill Improvement</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
