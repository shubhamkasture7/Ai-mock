"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
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

  const userEmail = user?.primaryEmailAddress?.emailAddress || "";

  const fetchHistory = useCallback(async () => {
    if (!userEmail) return;

    try {
      // Run DB queries in parallel for speed
      const [result, createdInterviews, answers] = await Promise.all([
        db
          .select({
            id: MockInterview.id,
            role: MockInterview.jsonPosition,
            date: MockInterview.createdAt,
            score: UserAnswer.rating,
          })
          .from(MockInterview)
          .leftJoin(
            UserAnswer,
            eq(MockInterview.mockId, UserAnswer.mockIdRef)
          )
          .where(eq(MockInterview.createdBy, userEmail))
          .orderBy(desc(MockInterview.id)),

        db
          .select()
          .from(MockInterview)
          .where(eq(MockInterview.createdBy, userEmail))
          .orderBy(desc(MockInterview.id)),

        db
          .select({
            rating: UserAnswer.rating,
            mockRef: UserAnswer.mockIdRef,
          })
          .from(UserAnswer)
          .leftJoin(
            MockInterview,
            eq(MockInterview.mockId, UserAnswer.mockIdRef)
          )
          .where(eq(MockInterview.createdBy, userEmail)),
      ]);

      setInterviewHistory(result || []);
      setTotalGenerated(createdInterviews?.length || 0);

      const ratingMap = {};
      for (const row of answers || []) {
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
  }, [userEmail]);

  useEffect(() => {
    if (userEmail) {
      fetchHistory();
    }
  }, [userEmail, fetchHistory]);

  // 📊 Stats (memoized)
  const { totalInterviews, averageScore, skillImprovement, timeSaved } =
    useMemo(() => {
      const total = totalGenerated || interviewHistory.length;
      const avg =
        total > 0
          ? (
              interviewHistory.reduce(
                (acc, item) => acc + (parseFloat(item.score) || 0),
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
    }, [totalGenerated, interviewHistory]);

  /* ----------------- SHADOW LOADER (SKELETON) ----------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto animate-pulse">
          {/* Top skeleton banner */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="h-5 w-48 bg-gray-200 rounded mb-3" />
            <div className="h-4 w-72 bg-gray-100 rounded" />
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="h-14 w-40 bg-gray-100 rounded-xl" />
              <div className="h-14 w-40 bg-gray-100 rounded-xl" />
            </div>
          </div>

          {/* Add interview skeleton */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
            <div className="h-10 w-48 bg-gray-100 rounded mb-4" />
            <div className="h-4 w-64 bg-gray-100 rounded mb-2" />
            <div className="h-10 w-56 bg-gray-200 rounded mt-4" />
          </div>

          {/* List skeleton */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="h-5 w-40 bg-gray-200 rounded mb-5" />
            <div className="space-y-3">
              <div className="h-10 w-full bg-gray-100 rounded-lg" />
              <div className="h-10 w-full bg-gray-100 rounded-lg" />
              <div className="h-10 w-full bg-gray-100 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ----------------- MAIN UI ----------------- */
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 🔵 Top Banner (minimal soft) */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold">
                Welcome back to your Interview Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Track your progress, create new mock sessions, and review past
                interviews.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                <p className="text-[11px] uppercase tracking-wide text-slate-300">
                  Total Interviews
                </p>
                <p className="text-lg font-semibold">{totalInterviews}</p>
              </div>
              <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                <p className="text-[11px] uppercase tracking-wide text-slate-300">
                  Avg. Score
                </p>
                <p className="text-lg font-semibold">{averageScore}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ➕ Add New Interview (more compact) */}
        <div className="bg-white rounded-2xl border border-gray-300 shadow-sm p-6 flex flex-col items-center text-center">
          <div className="w-10 h-10 flex items-center justify-center text-black bg-gray-100 rounded-full mb-2 text-xl">
            +
          </div>
          <h3 className="font-semibold text-black text-base">Create a new mock interview</h3>
          <p className="text-gray-500 text-xs mt-1 mb-3 max-w-sm">
            Generate AI-powered interview questions tailored to your role and
            experience.
          </p>
          <AddNewInterview />
        </div>

        {/* 📋 Previous Interviews */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Interview Lists
            </h3>
            <button className="text-xs font-medium text-blue-600 hover:underline">
              View All
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <InterviewList />
          </div>
        </section>

        {/* 📊 Stats Section (compact soft cards) */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Total Interviews</p>
            <h4 className="text-xl text-blue-900 font-semibold">{totalInterviews}</h4>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Average Score</p>
            <h4 className="text-xl text-blue-900 font-semibold">{averageScore}</h4>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Time Saved</p>
            <h4 className="text-xl text-blue-900 font-semibold">{timeSaved}</h4>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Skill Improvement</p>
            <h4 className="text-xl text-blue-900 font-semibold">{skillImprovement}</h4>
          </div>
        </section>

        {/* ⭐ Interviews by Rating */}
        {Object.keys(ratingCounts).length > 0 && (
          <section className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-800">
              Ratings snapshot
            </h4>
            <div className="flex flex-wrap gap-3">
              {Object.entries(ratingCounts).map(([rating, count]) => (
                <div
                  key={rating}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 text-center min-w-[110px]"
                >
                  <p className="text-[11px] text-gray-500 mb-1">
                    Rating {rating}
                  </p>
                  <p className="text-lg text-black font-semibold">{count}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
