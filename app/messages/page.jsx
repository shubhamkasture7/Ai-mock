"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, Sparkles } from "lucide-react";

export default function Messages() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        {/* Icon */}
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
          <MessageCircle className="h-6 w-6 text-indigo-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Messages are Coming Soon
        </h1>

        {/* Subtext */}
        <p className="text-sm text-gray-600 mb-6">
          You’ll soon be able to chat with interviewers, get follow-up feedback,
          and manage all your AI interview conversations in one place.
        </p>

        {/* Feature teaser chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 text-[11px]">
          <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            AI follow-up questions
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-100">
            Recruiter-style chat
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-100">
            Saved conversations
          </span>
        </div>

        {/* CTA */}
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg 
                     bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 
                     transition-colors shadow-sm"
        >
          Back to Dashboard
        </Link>

        {/* Small footer text */}
        <p className="mt-4 text-[11px] text-gray-400">
          We’re actively building this feature. Stay tuned for updates! 🚀
        </p>
      </div>
    </div>
  );
}
