// app/dashboard/interview/[interviewId]/page.js (or similar)
"use client";

import React, { useEffect, useState } from "react";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon, ArrowLeft, PlayCircle } from "lucide-react";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { Button } from "@/components/ui/button";

function Interview({ params }) {
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (params?.interviewId) {
      getInterviewDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.interviewId]);

  const getInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));

      if (result && result.length > 0) {
        setInterviewData(result[0]);
      }
    } catch (err) {
      console.error("Error fetching interview details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    router.push(`/dashboard/interview/${params.interviewId}/start`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-2 px-4 sm:px-6 lg:px-8">
      

        {/* Page Title */}
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-500">
            Mock Interview
          </p>
          <h1 className="font-bold text-2xl sm:text-3xl text-gray-900 mt-1">
            Let’s get you ready for your interview
          </h1>
          <p className="text-sm text-gray-600 mt-2 max-w-2xl">
            Review your interview details, check your camera and microphone, and
            start when you’re ready.
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-6 items-start">
          {/* Left: Interview Info */}
          <div className="space-y-4">
            {/* Interview Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Interview Details
                  </h2>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {loading
                      ? "Loading role..."
                      : interviewData?.jsonPosition || "Role not available"}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium">
                  AI Mock
                </span>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Job Description</p>
                  <p className="text-gray-600 mt-1">
                    {loading
                      ? "Loading description..."
                      : interviewData?.jsonDesc || "No description provided."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div>
                    <p className="font-medium text-gray-700 text-sm">
                      Experience Level
                    </p>
                    <p className="text-gray-600 text-sm mt-0.5">
                      {loading
                        ? "Loading..."
                        : interviewData?.jsonExperience
                        ? `${interviewData.jsonExperience} years`
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 text-sm">
                      Interview Mode
                    </p>
                    <p className="text-gray-600 text-sm mt-0.5">
                      AI Q&A with live feedback
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info / Tips Card */}
            <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-5">
              <h3 className="flex items-center gap-2 text-yellow-800 font-semibold mb-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Helpful Tips
              </h3>
              <p className="text-sm text-yellow-800">
                {process.env.NEXT_PUBLIC_INFORMATION ||
                  "Find a quiet place, ensure your internet connection is stable, and answer each question clearly. Focus on your structure, communication, and real-world examples."}
              </p>
            </div>
          </div>

          {/* Right: Webcam / Device Check */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              Camera & Microphone Check
            </h2>

            <div className="flex flex-col items-center">
              {webCamEnabled ? (
                <Webcam
                  mirrored
                  className="w-full max-w-xs aspect-[4/3] rounded-xl border border-gray-200 shadow-sm object-cover"
                />
              ) : (
                <div className="w-full max-w-xs">
                  <div className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                    <WebcamIcon className="h-16 w-16 text-gray-400" />
                  </div>
                  <p className="mt-3 text-xs text-gray-500 text-center">
                    Your camera view will appear here once enabled. Make sure
                    your browser has permission to access camera and microphone.
                  </p>
                </div>
              )}

              {!webCamEnabled && (
                <Button
                  onClick={() => setWebCamEnabled(true)}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white w-full max-w-xs"
                >
                  Enable Camera & Mic
                </Button>
              )}
            </div>

            <div className="mt-5 border-t pt-4 text-xs text-gray-500">
              <p>
                We only use your camera and microphone during the interview to
                simulate a real environment. Nothing is recorded unless
                explicitly mentioned.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-3">
          <div className="text-xs text-gray-500">
            When you click{" "}
            <span className="font-semibold text-gray-700">
              Start Interview
            </span>
            , questions will be shown one by one. You’ll answer them verbally or
            type-based depending on your setup.
          </div>

          <div className="flex gap-3">
            <Link href="/dashboard">
              <Button variant="outline" className="text-sm text-black">
                Cancel
              </Button>
            </Link>

            <Button
              onClick={handleStart}
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 text-sm px-6"
            >
              <PlayCircle className="w-4 h-4" />
              Start Interview
            </Button>
          </div>
        </div>
      </div>
  
  );
}

export default Interview;
