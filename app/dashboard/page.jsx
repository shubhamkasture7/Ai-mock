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
  const [totalGenerated, setTotalGenerated] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchHistory = async () => {
    try {
      // Main list (one row per answer; you might later aggregate per mock)
      const result = await db
        .select({
          id: MockInterview.id,
          role: MockInterview.jsonPosition,
          date: MockInterview.createdAt,
          score: UserAnswer.rating,
        })
        .from(MockInterview)
        .leftJoin(UserAnswer, eq(MockInterview.mockId, UserAnswer.mockIdRef))
        .where(
          eq(
            MockInterview.createdBy,
            user?.primaryEmailAddress?.emailAddress || ""
          )
        )
        .orderBy(desc(MockInterview.id));

      console.log("Dashboard Data:", result);
      setInterviewHistory(result);

      // Raw interviews count
      const createdInterviews = await db
        .select()
        .from(MockInterview)
        .where(
          eq(
            MockInterview.createdBy,
            user?.primaryEmailAddress?.emailAddress || ""
          )
        )
        .orderBy(desc(MockInterview.id));

      setTotalGenerated(createdInterviews.length);

      // Ratings per interview (distinct mockRef per rating)
      const answers = await db
        .select({
          rating: UserAnswer.rating,
          mockRef: UserAnswer.mockIdRef,
        })
        .from(UserAnswer)
        .leftJoin(MockInterview, eq(MockInterview.mockId, UserAnswer.mockIdRef))
        .where(
          eq(
            MockInterview.createdBy,
            user?.primaryEmailAddress?.emailAddress || ""
          )
        );

      const ratingMap = {};
      for (const row of answers) {
        const rating = row.rating;
        const mockRef = row.mockRef;
        if (!rating || !mockRef) continue;
        if (!ratingMap[rating]) ratingMap[rating] = new Set();
        ratingMap[rating].add(mockRef);
      }

      const ratingCountsObj = {};
      for (const [rating, set] of Object.entries(ratingMap)) {
        ratingCountsObj[rating] = set.size;
      }
      setRatingCounts(ratingCountsObj);
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
  const totalInterviews = totalGenerated || interviewHistory.length;
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 🔵 Top Banner */}
        <div className="bg-[#0A1730] text-white rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold">
            Welcome to your AI Mock Interview Dashboard
          </h2>
          <p className="text-sm text-gray-300 mt-1">
            Create and start your AI-powered mock interviews tailored to your
            role and experience.
          </p>

          {/* Stats Row inside banner */}
          <div className="flex flex-col sm:flex-row gap-6 mt-6">
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
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center mb-10 bg-white">
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

        {/* ⭐ Interviews by Rating */}
        {Object.keys(ratingCounts).length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-bold mb-2">Interviews by Rating</h4>
            <div className="flex flex-wrap gap-4">
              {Object.entries(ratingCounts).map(([rating, count]) => (
                <div
                  key={rating}
                  className="bg-white border rounded-xl p-4 text-center shadow-sm min-w-[120px]"
                >
                  <h5 className="text-xl font-semibold">{count}</h5>
                  <p className="text-gray-500 text-sm">Rating {rating}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
