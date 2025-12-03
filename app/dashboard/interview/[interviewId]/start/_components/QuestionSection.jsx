// app/components/QuestionSection.js
"use client";

import React, { useEffect } from "react";
import { Lightbulb, Volume2 } from "lucide-react";

function QuestionSection({
  mockInterviewQuestion,
  activeQuestionIndex,
  onChangeQuestion, // function(index) => void
}) {
  if (!Array.isArray(mockInterviewQuestion) || mockInterviewQuestion.length === 0) {
    return null;
  }

  const totalQuestions = mockInterviewQuestion.length;
  const currentQuestion = mockInterviewQuestion[activeQuestionIndex];

  const textToSpeech = (text) => {
    if (typeof window === "undefined") return;

    if ("speechSynthesis" in window) {
      // Stop anything already speaking
      window.speechSynthesis.cancel();

      if (!text) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn’t support text-to-speech.");
    }
  };

  // Stop TTS whenever question changes
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, [activeQuestionIndex]);

  // Stop TTS on unmount (changing page)
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="mt-8 p-6 rounded-2xl bg-white shadow-md border border-gray-100">
      {/* Header: title + progress */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
            Question {activeQuestionIndex + 1} of {totalQuestions}
          </p>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
            Interview Questions
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-20 h-1.5 rounded-full bg-gray-200 overflow-hidden">
            <span
              className="block h-full bg-indigo-500 transition-all"
              style={{
                width: `${((activeQuestionIndex + 1) / totalQuestions) * 100}%`,
              }}
            />
          </span>
          <span>
            {Math.round(((activeQuestionIndex + 1) / totalQuestions) * 100)}% complete
          </span>
        </div>
      </div>

      {/* Question pills (clickable) */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {mockInterviewQuestion.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              if (typeof onChangeQuestion === "function") {
                onChangeQuestion(index);
              }
            }}
            className={`min-w-[90px] px-3 py-2 rounded-full text-xs font-medium text-center border transition-all duration-200 ${
              activeQuestionIndex === index
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
            }`}
          >
            Q {index + 1}
          </button>
        ))}
      </div>

      {/* Current question + read-aloud button */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-base sm:text-lg font-medium text-gray-800 leading-relaxed flex-1">
          {currentQuestion?.question || "No question loaded."}
        </p>

        <button
          type="button"
          className="shrink-0 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-2 rounded-full shadow-sm border border-indigo-100 transition"
          onClick={() => textToSpeech(currentQuestion?.question)}
          aria-label="Read question aloud"
        >
          <Volume2 size={18} />
        </button>
      </div>

      {/* Tip section */}
      <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 mt-8 rounded-lg shadow-sm">
        <h3 className="flex items-center gap-2 text-yellow-800 font-semibold text-sm mb-1">
          <Lightbulb className="w-4 h-4" />
          Tip
        </h3>
        <p className="text-xs sm:text-sm text-yellow-900">
          {process.env.NEXT_PUBLIC_QUESTION_NOTE ||
            "Take a moment to structure your thoughts, then answer clearly with real examples."}
        </p>
      </div>
    </div>
  );
}

export default QuestionSection;
