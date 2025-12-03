"use client";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import InterviewItemCard from "./InterviewItemCard";
import ShadowLoader from "@/app/dashboard/_components/ShadowLoader"; // ⬅️ Import loader

function InterviewList() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchInterviewList();
  }, [user]);

  const fetchInterviewList = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(
          eq(
            MockInterview.createdBy,
            user?.primaryEmailAddress?.emailAddress
          )
        )
        .orderBy(desc(MockInterview.id));

      setInterviewList(result);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="font-semibold text-lg mb-3">Previous Mock Interviews</h2>

      {/* Loader when fetching data */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ShadowLoader key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* Show message if no history exists */}
          {interviewList.length === 0 ? (
            <div className="text-center text-gray-500 mt-5">
              No mock interviews created yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-4">
              {interviewList.map((interview) => (
                <InterviewItemCard key={interview.mockId} interview={interview} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default InterviewList;
