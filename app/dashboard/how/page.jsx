'use client';

import React from 'react';

export default function HowItWorksPage() {
  const steps = [
    {
      title: '1. Sign Up / Log In',
      description: 'Get started by signing up or logging in. You can use your Google account or email for easy access.',
    },
    {
      title: '2. Choose Your Role',
      description: 'Select a domain like Web Developer, Data Analyst, or any role you want to practice for.',
    },
    {
      title: '3. Practice Mode (Free)',
      description: 'Try unlimited AI-powered mock questions with instant feedback. No cost involved!',
    },
    {
      title: '4. Real-Time Mode (Paid)',
      description: 'Pay once to unlock real-time interactive interviews and premium analysis.',
    },
    {
      title: '5. Analyze Performance',
      description: 'Review detailed analytics to identify strengths, weaknesses, and improve steadily.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white py-12 px-4 pt-[100px] md:px-16">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 mb-12">
        How It Works
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className="group bg-white p-6 rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 duration-300"
          >
            <div className="text-2xl font-semibold text-blue-600 mb-2 group-hover:text-blue-800 transition">
              {step.title}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* Project Description Section */}
      <div className="max-w-4xl mx-auto mt-20 bg-white rounded-2xl shadow-md p-8 border border-gray-100">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-gray-800">
          About This Project
        </h2>
        <p className="text-gray-600 text-center text-sm md:text-base leading-relaxed">
          This AI-powered mock interview platform is designed for students and professionals to practice technical and behavioral interviews.
          Users can select a role, engage with practice questions for free, and unlock real-time AI-driven sessions by upgrading. The system
          mimics real interviews using smart question logic, performance analysis, and role-specific preparation tools — all in one place.
        </p>
      </div>
    </div>
  );
}
