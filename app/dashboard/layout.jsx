// app/dashboard/layout.js
"use client";

import React from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Bell, Settings } from "lucide-react";

function DashboardLayout({ children }) {
  const { user } = useUser();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* 🌈 Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between text-white">
          
          {/* Left: Logo + Brand */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center shadow-md">
<img 
  src="/logo.svg" 
  alt="Logo"
  className="h-30 w-30 object-contain"
/>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-sm sm:text-base">
                NextGenHire
              </span>
              <span className="text-xs text-white/80 hidden sm:block">
                AI Interview & Career Hub
              </span>
            </div>
          </div>

          {/* Center: Nav Links (Desktop)
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/dashboard" className="hover:text-yellow-200/90">
              Overview
            </Link>
            <Link
              href="/dashboard/mock-interviews"
              className="hover:text-yellow-200/90"
            >
              Mock Interviews
            </Link>
            <Link href="/jobs" className="hover:text-yellow-200/90">
              Jobs
            </Link>
            <Link href="/skills" className="hover:text-yellow-200/90">
              Skills
            </Link>
          </nav> */}

          {/* Right: User Info + Actions */}
          <div className="flex items-center gap-3">
            {/* Upgrade pill (desktop only) */}
            <button className="hidden sm:inline-flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition px-2.5 py-1.5 text-xs font-medium">
              Upgrade to Pro
            </button>

            {/* Notifications */}
            <button className="hidden sm:inline-flex p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
              <Bell className="w-4 h-4" />
            </button>

            {/* User avatar + name */}
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-2 py-1">
              <div className="hidden sm:flex flex-col leading-tight mr-1 max-w-[140px]">
                <span className="text-[10px] text-white/70">
                  Logged in as
                </span>
                <span className="text-sm font-semibold truncate">
                  {user?.fullName || user?.username || "Guest"}
                </span>
              </div>

              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="User avatar"
                  className="h-8 w-8 rounded-full border border-white/60 object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">
                  {(user?.firstName?.[0] || "U").toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
