"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left: Brand / Copy */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            AI-powered interview practice
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Next Gen Hire
              </span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-md">
              Crack your next interview with AI-powered mock interviews, smart
              feedback, and tailored preparation for your dream role.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
              <p className="text-xs font-medium text-slate-400 mb-1">
                Real-time practice
              </p>
              <p className="text-slate-200">
                Simulate real interview environments with role-based question
                sets.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
              <p className="text-xs font-medium text-slate-400 mb-1">
                Actionable insights
              </p>
              <p className="text-slate-200">
                Get instant scoring, strengths, and improvement tips after every
                session.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            No recruiter pressure. Just you, your skills, and a smarter way to
            practice.
          </p>
        </div>

        {/* Right: Auth Card */}
        <div className="relative">
          {/* Glow background */}
          <div className="pointer-events-none absolute -inset-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-blue-500/10 blur-2xl" />

          <div className="relative rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-sm px-5 py-6 sm:px-7 sm:py-8 shadow-[0_18px_45px_rgba(15,23,42,0.75)]">
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-50">
                Sign in to continue
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Access your dashboard, interview history, and personalized
                recommendations.
              </p>
            </div>

            {/* Clerk SignIn component */}
            <div className="flex justify-center">
              <SignIn
  appearance={{
    // Global color variables for Clerk
    variables: {
      colorBackground: "transparent",        // no extra card bg
      colorText: "#e5e7eb",                  // slate-200
      colorInputBackground: "#020617",       // slate-950
      colorInputText: "#e5e7eb",             // slate-200
      colorInputBorder: "#1f2937",           // slate-800
      colorPrimary: "#22c55e",               // emerald-500
      colorTextOnPrimaryBackground: "#0b1120", // slate-950
    },
    elements: {
      rootBox: "w-full",
      card: "bg-transparent shadow-none border-0 text-slate-50",

      headerTitle: "text-slate-50",
      headerSubtitle: "text-slate-400",

      formFieldLabel: "text-slate-300",
      formFieldInput:
        "bg-slate-900 border border-slate-700 text-slate-50 placeholder:text-slate-500",

      formButtonPrimary:
        "bg-emerald-500 hover:bg-emerald-600 text-sm normal-case border-0",

      footerActionText: "text-slate-400 text-sm",
      footerActionLink: "text-emerald-400 hover:text-emerald-300 text-sm",

      socialButtonsBlockButton:
        "border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-50 text-sm",

      // dev-mode banner text/background tweak (optional)
      alert: "bg-slate-900/80 text-slate-300 border-slate-700",
    },
  }}
/>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
